import { PageHeader } from "@/components/PageHeader"
import { SignIn } from "@stackframe/stack"

export default function SignInPage() {
	return (
		<>
			<PageHeader title="Sign In" />
			<div className="flex h-[70vh] w-screen items-center justify-center">
				<SignIn />
			</div>
		</>
	)
}
