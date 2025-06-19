import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { User } from "../../../../../models/model";
import { getUserId } from "../../../../../lib/getUserId";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json(
        { error: "No existe un usuario" },
        { status: 401 },
      );

    const { currentPassword, newPassword } = await req.json();

    const user = await User.findById(userId);
    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!passwordCorrect) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta." },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
