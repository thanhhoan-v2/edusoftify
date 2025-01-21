import NavBar from "@/components/ui/NavBar";
import { SignIn } from "@stackframe/stack";

export default function SignInPage() {
	return (
		<>
			<NavBar title="Sign In" showAuthButton={false} />
			<div className="flex justify-center items-center w-screen h-[70vh]">
				<SignIn />
			</div>
		</>
	);
}
