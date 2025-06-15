import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import { Model } from "../../../../../../models/model";
import {getUserId} from  "../../../../../../lib/getUserId"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const model = await Model.findById(params.id);
    if (!model) {
      return NextResponse.json({ error: "Modelo no encontrado" }, { status: 404 });
    }

    if (model.creator.toString() !== userId.toString() && !model.participants.includes(userId)) {
        model.participants.push(userId);
        await model.save();
    }

    return NextResponse.json({ model });
  } catch (error) {
    console.error("Error al obtener modelo:", error);
    return NextResponse.json({ error: "Error al obtener modelo" }, { status: 500 });
  }
}