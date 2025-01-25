"use server"

import { PageHeader } from "@/components/PageHeader"
import UserProfile from "@/components/user-profile"
import { stackServerApp } from "@/stack"

export default async function UserProfilePage({
	params,
}: { params: { userId: string } }) {
	const user = await stackServerApp.getUser(params.userId)

	const serializedUser = {
		id: user?.id ?? "",
		userName: user?.displayName ?? "",
		avatarUrl: user?.profileImageUrl ?? "",
	}

	return (
		<>
			<PageHeader title="Profile" />
			<UserProfile initialUser={serializedUser} />
		</>
	)
}
