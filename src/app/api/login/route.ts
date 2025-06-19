import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User } from "../../../../models/model";
import bcrypt from "bcrypt";
import { generarToken } from "../../../../lib/auth";
import * as cookie from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }
    const token = generarToken(usuario._id.toString());

    const response = NextResponse.json({
      mensaje: "Inicio de sesión con exitó",
    });

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 36000,
        path: "/",
      }),
    );
    return response;
  } catch (error) {
    console.error("Error al entrar a la cuenta:", error);
    return NextResponse.json(
      { error: "Error al entrar a la cuenta" },
      { status: 500 },
    );
  }
}
