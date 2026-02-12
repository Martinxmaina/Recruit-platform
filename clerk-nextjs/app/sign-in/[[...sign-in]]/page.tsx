import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
	const { userId } = await auth();

	// Redirect authenticated users to dashboard
	if (userId) {
		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<SignIn
				routing="path"
				path="/sign-in"
				signUpUrl="/sign-up"
				afterSignInUrl="/dashboard"
				forceRedirectUrl="/dashboard"
			/>
		</div>
	);
}
