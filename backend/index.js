const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

//
const app = express();
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("App Connected to DB successfully");
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`);
  });

const userSchema = new mongoose.Schema({
  email: String,
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());

app.post("/api/reset-password/request", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = Math.random().toString(36).substring(7);
  const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email" });
    }
    res.json({ message: "Password reset email sent successfully" });
  });
});

app.post("/api/reset-password/verify", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  const user = await User.findOne({ resetToken });

  if (!user || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
