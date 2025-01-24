"use client"
import { Button } from "@/components/ui/button"
import {
	COURSES_PAGE,
	HOME_PAGE,
	SEARCH_PAGE,
	SIGN_IN_PAGE,
	THEME_SETTINGS_PAGE,
} from "@/lib/routes"
import { UserButton, useStackApp } from "@stackframe/stack"
import { AlignLeft, Home, Palette, Search, Settings } from "lucide-react"
import Link from "next/link"

type NavBarProps = {
	weekNumber?: string | null
	title?: string
	showAuthButton?: boolean
}

export default function NavBar({
	weekNumber,
	title,
	showAuthButton = true,
}: NavBarProps) {
	const app = useStackApp()
	const user = app.useUser()

	return (
		<>
			<div className="navbar fixed top-0 right-0 left-0 z-50 flex-between bg-base-100 px-3 py-2 shadow-md transition-transform duration-300 ease-in-out">
				<div className="navbar-start">
					<div className="drawer z-40">
						<input id="my-drawer" type="checkbox" className="drawer-toggle" />
						<div className="drawer-content">
							<label
								htmlFor="my-drawer"
								className="drawer-button btn btn-ghost"
							>
								<AlignLeft />
							</label>
						</div>
						<div className="drawer-side">
							<label
								htmlFor="my-drawer"
								aria-label="close sidebar"
								className="drawer-overlay"
							/>
							<ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
								<li>
									<Link href={HOME_PAGE}>
										<Home />
										Home
									</Link>
								</li>
								{user && (
									<li>
										<Link href={COURSES_PAGE}>
											<Settings />
											Edit courses
										</Link>
									</li>
								)}
								<li>
									<Link href={THEME_SETTINGS_PAGE}>
										<Palette />
										Theme settings
									</Link>
								</li>
								<li>
									<Link href={SEARCH_PAGE}>
										<Search />
										Search
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="navbar-center">
					{weekNumber ? (
						<p className="btn btn-ghost text-xl">Week {weekNumber}</p>
					) : (
						<p className="btn btn-ghost text-xl">{title}</p>
					)}
				</div>
				<div className="navbar-end gap-4">
					{showAuthButton && (
						<div>
							{user ? (
								<UserButton />
							) : (
								<a href={SIGN_IN_PAGE}>
									<Button>Sign in</Button>
								</a>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="h-[70px] w-[100px]" />
		</>
	)
}
