import { NextResponse } from "next/server";
import { User } from "../../../../../models/model";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDatabase } from "../../../../../lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();
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
    from: process.env.SMTP_USER,
    subject: "Restablece tu contraseña ERdoc Playground",
    html:  `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px;">
      <p>Hola <strong>${user.name}</strong>,</p>

      <p>Haz clic en el siguiente botón para restablecer tu contraseña de la aplicación <strong>ERdoc Playground</strong>:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank" 
          style="
            background-color: #1a73e8; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block;
            font-weight: bold;
          ">
          Restablecer contraseña
        </a>
      </p>

      <p>O copia y pega este enlace en tu navegador:</p>
      <p style="word-break: break-word; font-size: 14px; color: #555;">${resetLink}</p>

      <p style="color: #777; font-size: 14px;">
        El enlace es válido por una hora.<br>
        Si no solicitaste este cambio, ignora este correo.
      </p>
    </div>
  `,
  });

  return NextResponse.json({ message: "Email enviado" });
}
