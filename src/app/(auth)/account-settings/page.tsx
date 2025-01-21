"use client";
import NavBar from "@/components/ui/NavBar";
import { AccountSettings } from "@stackframe/stack";

export default function AccountSettingsPage() {
	return (
		<>
			<NavBar title="Account Settings" />
			<AccountSettings />;
		</>
	);
}
