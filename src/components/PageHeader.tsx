"use client"
import { Button } from "@/components/ui/button"
import { HOME_PAGE, SEARCH_PAGE } from "@/lib/routes"
import { createClient } from "@/utils/supabase/client"
import { UserButton, useStackApp } from "@stackframe/stack"
import { Search, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const PageHeader = ({ title }: { title: string }) => {
	const app = useStackApp()
	const user = app.useUser()
	const supabase = createClient()
	const router = useRouter()

	useEffect(() => {
		const syncUser = async () => {
			if (!user) return

			try {
				const { data: existingUser } = await supabase
					.from("users")
					.select("*")
					.eq("id", user?.id)
					.single()

				if (!existingUser) {
					await supabase.from("users").upsert({
						id: user.id,
					})
				}
			} catch (error) {
				console.error("Error syncing user:", error)
			}
		}

		syncUser()
	}, [user])

	return (
		<>
			<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
				{user && (
					<Link href={SEARCH_PAGE}>
						<Button variant="ghost">
							<Search />
						</Button>
					</Link>
				)}

				<Link href={HOME_PAGE}>
					<div className="rounded-lg border-2 bg-black p-2 text-white">
						<h1 className="font-bold">Edusoftify</h1>
					</div>
				</Link>

				<div>
					<UserButton
						extraItems={[
							{
								text: "Profile",
								icon: <User size={17} />,
								onClick: () => router.push(`/${user?.id}`),
							},
						]}
					/>
				</div>
			</header>
		</>
	)
}
