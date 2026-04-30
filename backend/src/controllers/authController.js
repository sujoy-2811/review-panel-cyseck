import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../lib/mailer.js";

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // always respond the same way — never reveal whether the email exists
  res.json({
    message: "If that email is registered, a reset link has been sent.",
  });

  const employee = await prisma.employee.findUnique({ where: { email } });
  // if (!employee || employee.deletedAt) return

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  sendPasswordResetEmail({ email, token });
}

export async function validateResetToken(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token is required" });

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  res.json({ email: record.email });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: "Token and password are required" });
  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.employee.update({
      where: { email: record.email },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() },
    }),
  ]);

  res.json({ message: "Password updated successfully" });

  sendPasswordResetSuccessEmail({ email: record.email })
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const employee = await prisma.employee.findUnique({ where: { email } });
  if (!employee || employee.deletedAt)
    return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, employee.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const { passwordHash, ...user } = employee;
  res.json({ token, user });
}
