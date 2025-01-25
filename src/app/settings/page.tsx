"use client"
import { PageHeader } from "@/components/PageHeader"
import { AccountSettings } from "@stackframe/stack"

export default function SettingsPage() {
	return (
		<>
			<PageHeader title="Settings" />
			<AccountSettings fullPage={true} />
		</>
	)
}
