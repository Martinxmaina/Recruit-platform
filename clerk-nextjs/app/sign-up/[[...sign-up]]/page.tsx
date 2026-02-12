import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default async function SignUpPage() {
	const { userId } = await auth();

	// Redirect authenticated users to dashboard
	if (userId) {
		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<SignUp
				routing="path"
				path="/sign-up"
				signInUrl="/sign-in"
				afterSignUpUrl="/dashboard"
				forceRedirectUrl="/dashboard"
			/>
		</div>
	);
}
