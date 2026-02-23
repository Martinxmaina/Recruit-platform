import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const protectedPathPrefixes = [
	"/dashboard",
	"/clients",
	"/jobs",
	"/candidates",
	"/automation",
	"/settings",
];
const protectedApiPrefix = "/api/v1";

function isProtectedRoute(pathname: string): boolean {
	if (pathname.startsWith(protectedApiPrefix)) return true;
	return protectedPathPrefixes.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		// Env missing: allow request through; protected routes will show errors
		return NextResponse.next({ request });
	}

	let response = NextResponse.next({ request });
	const supabase = createServerClient<Database>(url, anonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) =>
					response.cookies.set(name, value, options)
				);
			},
		},
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (isProtectedRoute(request.nextUrl.pathname) && !session) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("next", request.nextUrl.pathname);
		return NextResponse.redirect(signInUrl);
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
