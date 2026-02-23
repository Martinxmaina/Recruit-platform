import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignUpPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const session = await getSession();
	if (session) redirect("/dashboard");
	const { error } = await searchParams;

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Sign up</CardTitle>
					<CardDescription>Create an account with email and password</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<p className="mb-4 text-sm text-destructive" role="alert">
							{decodeURIComponent(error)}
						</p>
					)}
					<form action={signUp} className="flex flex-col gap-4">
						<Input
							name="email"
							type="email"
							placeholder="Email"
							required
							autoComplete="email"
						/>
						<Input
							name="password"
							type="password"
							placeholder="Password"
							required
							autoComplete="new-password"
							minLength={6}
						/>
						<Button type="submit" className="w-full">
							Sign up
						</Button>
					</form>
					<p className="mt-4 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/sign-in" className="font-medium text-primary underline">
							Sign in
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
