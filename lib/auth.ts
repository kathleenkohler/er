import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export function generarToken(userId: string) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "10h" });
}

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}
