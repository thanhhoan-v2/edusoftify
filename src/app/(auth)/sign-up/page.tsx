import { PageHeader } from "@/components/PageHeader"
import { SignUp } from "@stackframe/stack"

export default function SignUpPage() {
	return (
		<>
			<PageHeader title="Sign Up" />
			<div className="flex h-[70vh] w-screen items-center justify-center">
				<SignUp />
			</div>
		</>
	)
}
