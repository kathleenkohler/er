import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

const protectedRoutes = [
  "/user",
  "/user/shared",
  "/user/change-password",
  "/es/user",
  "/es/user/shared",
  "/es/user/change-password",
];
const publicRoutes = ["/login", "/register", "/es/login", "/es/register"];

async function verificarToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);
  const path = req.nextUrl.pathname;

  // Verificación de token JWT
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const valid = token ? await verificarToken(token) : null;

  //Ruta privada sin token
  if (!valid && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si la ruta es pública pero loggeado
  if (publicRoutes.includes(path) && valid) {
    return NextResponse.redirect(new URL("user", req.url));
  }

  if (intlResponse) {
    return intlResponse;
  }

  return NextResponse.next();
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next", "docs" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|docs|_next|.*\\..*).*)"],
};
