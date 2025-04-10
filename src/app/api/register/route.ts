import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User } from "../../../../models/model";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    await connectToDatabase();

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const nuevoUsuario = new User({ name, email, password: hashedPassword });
    await nuevoUsuario.save();

    return NextResponse.json({ mensaje: "Usuario registrado con éxito", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    const usuarios = await User.find();
    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
