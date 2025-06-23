import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User } from "../../../../models/model";
import bcrypt from "bcrypt";
import { generarToken } from "../../../../lib/auth";
import * as cookie from "cookie";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ya existe un usuario asociado a ese correo electrónico" },
        { status: 409 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const nuevoUsuario = new User({ name, email, password: hashedPassword });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id.toString());

    const response = NextResponse.json({
      mensaje: "Usuario registrado con éxito",
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
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 },
    );
  }
}
