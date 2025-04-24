import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { User } from "../../../../models/model";
import {getUserId} from  "../../../../lib/getUserId"

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
