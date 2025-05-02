import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Model } from "../../../../../models/model";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const model = await Model.findById(params.id);
    return NextResponse.json( model );
  } catch (error) {
    console.error("Error al obtener modelo:", error);
    return NextResponse.json({ error: "Error al obtener modelo" }, { status: 500 });
  }
}