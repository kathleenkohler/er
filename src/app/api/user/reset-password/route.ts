import { NextResponse } from "next/server";
import { User } from "../../../../../models/model";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Token inválido o expirado" },
      { status: 400 },
    );
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ message: "Contraseña actualizada" });
}
