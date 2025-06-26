import { NextResponse } from "next/server";
import { User } from "../../../../../models/model";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, locale } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000);
  await user.save();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const resetLink = `${baseUrl}/${locale}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const info = await transporter.sendMail({
    to: user.email,
    from: process.env.EMAIL_FROM,
    subject: "Restablece tu contraseña ERdoc Playground",
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    html: `
      <p>Hola,</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>El enlace es válido por una hora.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
  });

  return NextResponse.json({ message: "Email enviado" });
}
