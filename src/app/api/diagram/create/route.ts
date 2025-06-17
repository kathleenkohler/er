import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Model } from "../../../../../models/model";
import * as cookie from "cookie";
import { getUserId } from "../../../../../lib/getUserId";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    await connectToDatabase();
    const userId = await getUserId();
    const nuevoModelo = new Model({ name, json: {
      "erDoc": "entity user {\r\n    email key\r\n    password\r\n}",
      "nodes": [
        {
          "id": "0",
          "position": {
            "x": 703.2180298817334,
            "y": 142.75061023849884
          }
        },
        {
          "id": "1",
          "position": {
            "x": 134.60774529769014,
            "y": 0.25316738533879857
          }
        },
        {
          "id": "2",
          "position": {
            "x": 0,
            "y": 100
          }
        }
      ],
      "edges": [
        {
          "id": "entity-attr: user->email",
          "source": "0",
          "target": "1"
        },
        {
          "id": "entity-attr: user->password",
          "source": "0",
          "target": "2"
        }
      ]
    }, creator: userId, participants: []});
    await nuevoModelo.save();

    const response = NextResponse.json({ id: nuevoModelo._id });
    return response;
    
  } catch (error) {
    console.error("Error al entrar a la cuenta:", error);
    return NextResponse.json({ error: "Error al entrar a la cuenta" }, { status: 500 });
  }
}
