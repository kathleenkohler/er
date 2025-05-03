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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    await Model.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return NextResponse.json({ error: "Error al eliminar el modelo" }, { status: 500 });
  }
}