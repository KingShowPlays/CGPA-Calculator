// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const maintenanceMode = false; // set to false to turn off maintenance mode

  if (maintenanceMode) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
