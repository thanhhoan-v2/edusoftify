"use client";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/app-themes";
import { EDIT_COURSES_PAGE, HOME_PAGE, SIGN_IN_PAGE } from "@/lib/routes";
import { UserButton, useStackApp } from "@stackframe/stack";
import { AlignLeft, Shuffle } from "lucide-react";
import React from "react";

type NavBarProps = {
	weekNumber?: string | null;
	title?: string;
	showAuthButton?: boolean;
};

export default function NavBar({
	weekNumber,
	title,
	showAuthButton = true,
}: NavBarProps) {
	const [currentTheme, setCurrentTheme] = React.useState("light");

	const app = useStackApp();
	const user = app.useUser();

	const handleRandomizeTheme = () => {
		const randomTheme = themes[Math.floor(Math.random() * themes.length)];
		document.documentElement.setAttribute("data-theme", randomTheme);
		setCurrentTheme(randomTheme);
	};

	return (
		<>
			<div className="navbar bg-base-100">
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
							<ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
								<li>
									<a href={HOME_PAGE}>Home</a>
								</li>
								<li>
									<a href={EDIT_COURSES_PAGE}>Edit courses</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="dropdown">
						<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
							<li>
								<a>Homepage</a>
							</li>
							<li>
								<a>Portfolio</a>
							</li>
							<li>
								<a>About</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="navbar-center">
					{weekNumber ? (
						<a className="btn btn-ghost text-xl">Week {weekNumber}</a>
					) : (
						<p className="btn btn-ghost text-xl">{title}</p>
					)}
				</div>
				<div className="navbar-end gap-4">
					<button
						className="btn flex btn-ghost theme-controller"
						onClick={handleRandomizeTheme}
					>
						<Shuffle /> <p>{currentTheme}</p>
					</button>

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
		</>
	);
}
