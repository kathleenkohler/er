import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User, Model } from "../../../../models/model";
import {getUserId} from  "../../../../lib/getUserId"
import * as cookie from "cookie";

export async function GET() {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    const user = await User.findById(userId).select('-password');
    return NextResponse.json( user );
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const userId = await getUserId();

    await Model.updateMany({ participants: userId }, { $pull: { participants: userId } });
    await Model.deleteMany({ creator: userId });
    await User.findByIdAndDelete(userId);

    const response = NextResponse.json({ message: "Cuenta eliminada correctamente" });

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: "/",
      })
  );

    return response;
  } catch (error) {
    console.error("Error al eliminar al usuario:", error);
    return NextResponse.json({ error: "Error al eliminar al usuario" }, { status: 500 });
  }
}