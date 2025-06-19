import { NextResponse } from "next/server";
import { getUserId } from "../../../../../lib/getUserId";
import * as cookie from "cookie";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "No hay un usuario" }, { status: 401 });
    }

    const response = NextResponse.json({ mensaje: "Sesión cerrada" });

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        path: "/",
      }),
    );

    return response;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}
