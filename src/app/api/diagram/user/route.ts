import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Model } from "../../../../../models/model";
import { getUserId } from "../../../../../lib/getUserId";

export async function GET() {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    const diagrams = await Model.find({ creator: userId });
    return NextResponse.json(diagrams);
  } catch (error) {
    console.error("Error al obtener diagramas:", error);
    return NextResponse.json(
      { error: "Error al obtener diagramas" },
      { status: 500 },
    );
  }
}
