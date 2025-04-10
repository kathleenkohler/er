import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User } from "../../../../models/model";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if ( !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    await connectToDatabase();

    const usuario = await User.findOne({ email });
    if (!usuario) {
        return NextResponse.json({ error: "Usuario no existe"}, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    return NextResponse.json({ mensaje: "Inicio de sesión con exitó" , usuario });
    
  } catch (error) {
    console.error("Error al entrar a la cuenta:", error);
    return NextResponse.json({ error: "Error al entrar a la cuenta" }, { status: 500 });
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
