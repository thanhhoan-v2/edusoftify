import NavBar from "@/components/ui/NavBar";
import { SignUp } from "@stackframe/stack";

export default function SignUpPage() {
	return (
		<>
			<NavBar title="Sign Up" showAuthButton={false} />
			<div className="flex justify-center items-center w-screen h-[70vh]">
				<SignUp />
			</div>
		</>
	);
}
