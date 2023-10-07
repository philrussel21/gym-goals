import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import {cookies} from 'next/headers';


export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code !== null) {
    // Grabs the cookie from the request and passes it to the client and
    // authenticates the user based on the code attached in the URL.
    const supabase = createRouteHandlerClient({cookies});
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(url.origin);
}