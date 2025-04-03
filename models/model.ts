import mongoose, { Schema, Document, models } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

interface IModel extends Document {
  name: string;
  json: Record<string, any>;
  creator: IUser["_id"];
  participants: IUser["_id"][];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ModelSchema = new Schema<IModel>({
  name: { type: String, required: true },
  json: { type: Schema.Types.Mixed, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = models.User || mongoose.model<IUser>("User", UserSchema);
const Model =  models.Model || mongoose.model<IModel>("Model", ModelSchema);

export { User, Model };


