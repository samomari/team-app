import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./utils/auth";

const protectedRoutes = ["/dashboard", "/api/user", "/api/logout", "/api/block", "/api/unblock", "/api/delete"];
const publicRoutes = ["/auth", "/api/login", "/api/register"];

export default async function middleware(req: NextRequest) {
    const path =  req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth", req.nextUrl));
    }
    
    if (accessToken) {
        try {
         const decodedToken = await verifyAccessToken(accessToken);
            if (!decodedToken) {
                const response = NextResponse.redirect(new URL("/auth", req.nextUrl), {
                  status: 302,
                });
                response.cookies.delete("accessToken");
                console.log("heloooo");
                return response;
              }
          
          
        } catch (error) {
          return NextResponse.redirect(new URL("/auth", req.nextUrl));
        }
      }

    if (accessToken && !isProtectedRoute&& !req.nextUrl.pathname.startsWith('dashboard')) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api1|_next/static|_next/image|.*\\.png$).*)'],
};
