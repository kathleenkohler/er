import { cookies } from 'next/headers';
import { verificarToken } from './auth';

export async function getUserId() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const payload = await verificarToken(token);
  if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
   return null;
  }

  return payload.userId;
}
