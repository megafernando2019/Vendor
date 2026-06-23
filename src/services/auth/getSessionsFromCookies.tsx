import { cookies } from 'next/headers';

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const user = cookieStore.get('user')?.value;
  const mueblerias = cookieStore.get('mueblerias_asignadas')?.value;

  return {
    user: user ? JSON.parse(user) : null,
    mueblerias: mueblerias ? JSON.parse(mueblerias) : null,
  };
}