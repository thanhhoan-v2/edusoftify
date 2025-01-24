"use client"
import NavBar from "@/components/ui/NavBar"
import { AccountSettings } from "@stackframe/stack"

export default function SettingsPage() {
	return (
		<>
			<NavBar title="Settings" />
			<AccountSettings fullPage={false} />
		</>
	)
}
