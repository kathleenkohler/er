import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Model } from "../../../../../models/model";
import {getUserId} from  "../../../../../lib/getUserId"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "No existe un usuario" }, { status: 401 });

    const model = await Model.findById(params.id);
    if (!model) {
      return NextResponse.json({ error: "Modelo no encontrado" }, { status: 404 });
    }

    const isAuthorized = model.creator.toString() === userId.toString() ||
    model.participants.some((p: any) => p.toString() === userId.toString());

    return NextResponse.json({ model, isAuthorized });
  } catch (error) {
    console.error("Error al obtener modelo:", error);
    return NextResponse.json({ error: "Error al obtener modelo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "No existe un usuario" }, { status: 401 });

    const model = await Model.findById(params.id);
    if (!model) return NextResponse.json({ error: "Modelo no encontrado" }, { status: 404 });

    if (model.creator.toString() === userId.toString()) {
      await model.deleteOne();
      return NextResponse.json({ message: "Modelo eliminado por el creador" });
    }

    model.participants = model.participants.filter((p: any) => p.toString() !== userId);
    await model.save();
    return NextResponse.json({ message: "Eliminado de los compartidos" });
    
  } catch (error) {
    console.error("Error al eliminar el modelo:", error);
    return NextResponse.json({ error: "Error al eliminar el modelo" }, { status: 500 });
  }
}