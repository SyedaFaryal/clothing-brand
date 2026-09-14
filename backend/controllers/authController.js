import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password }); // role defaults to "customer"
    const token = signToken(user);
    res.status(201).json({ success: true, data: { user: sanitize(user), token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({ success: true, data: { user: sanitize(user), token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, data: sanitize(req.user) });
};

// No email service is configured in this demo, so the reset link/token is
// returned directly in the API response (and logged to the server console)
// instead of being emailed. Wire up a real mail provider (SendGrid, SES,
// Nodemailer + SMTP, etc.) in production and send `resetUrl` there instead.
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  // Always respond success (even if no account exists) so this endpoint
  // can't be used to enumerate registered emails.
  if (!user) {
    return res.json({
      success: true,
      message: "If that account exists, a reset link has been generated.",
    });
  }

  const rawToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.body.appUrl || "http://localhost:5174"}/reset-password/${rawToken}`;
  console.log(`Password reset requested for ${user.email}: ${resetUrl}`);

  res.json({
    success: true,
    message: "Reset link generated (no email service configured in this demo).",
    // Demo-only: in production this token is emailed, never returned in the API.
    resetUrl,
    resetToken: rawToken,
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

 

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password +resetPasswordToken +resetPasswordExpire");

  if (!user) {
    return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token2 = signToken(user);
  res.json({ success: true, message: "Password updated", data: { user: sanitize(user), token: token2 } });
};
