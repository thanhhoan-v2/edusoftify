import { AlignLeft, Shuffle } from "lucide-react";
import React from "react";

const themes = [
	"light",
	"dark",
	"cupcake",
	"bumblebee",
	"emerald",
	"corporate",
	"synthwave",
	"retro",
	"cyberpunk",
	"valentine",
	"halloween",
	"garden",
	"forest",
	"aqua",
	"lofi",
	"pastel",
	"fantasy",
	"wireframe",
	"black",
	"luxury",
	"dracula",
	"cmyk",
	"autumn",
	"acid",
	"lemonade",
	"night",
	"coffee",
	"winter",
	"dim",
	"nord",
	"sunset",
];

export default function NavBar() {
	const [currentTheme, setCurrentTheme] = React.useState("light");

	const handleRandomizeTheme = () => {
		const randomTheme = themes[Math.floor(Math.random() * themes.length)];
		document.documentElement.setAttribute("data-theme", randomTheme);
		setCurrentTheme(randomTheme);
	};

	return (
		<>
			<div className="navbar bg-base-100">
				<div className="navbar-start">
					<div className="drawer">
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
									<a>Sidebar Item 1</a>
								</li>
								<li>
									<a>Sidebar Item 2</a>
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
					<a className="btn btn-ghost text-xl">TKB</a>
				</div>
				<div className="navbar-end">
					<button
						className="btn flex btn-ghost theme-controller"
						onClick={handleRandomizeTheme}
					>
						<Shuffle /> <p>{currentTheme}</p>
					</button>
				</div>
			</div>
		</>
	);
}
