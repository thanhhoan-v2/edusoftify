"use client";
import NavBar from "@/components/ui/NavBar";
import { themes } from "@/lib/app-themes";
import { useEffect, useState } from "react";

export default function ThemeSettingsPage() {
	const [currentTheme, setCurrentTheme] = useState("light");

	useEffect(() => {
		if (localStorage.getItem("theme")) {
			document.documentElement.setAttribute(
				"data-theme",
				localStorage.getItem("theme")!,
			);
			setCurrentTheme(localStorage.getItem("theme")!);
		}
	});

	return (
		<>
			<NavBar title="Theme Settings" />
			<div className="form-control p-4">
				{themes.map((theme) => (
					<>
						<label className="label cursor-pointer gap-4">
							<span className="label-text">{capitalizeFirstLetter(theme)}</span>
							<input
								type="radio"
								name="theme-radios"
								className="radio theme-controller"
								value={theme}
								onChange={(e) => {
									setCurrentTheme(e.target.value);
									localStorage.setItem("theme", e.target.value);
								}}
							/>
						</label>
						<div className="divider divider-secondary" />
					</>
				))}
			</div>
		</>
	);
}

const capitalizeFirstLetter = (s: string) => {
	if (!s) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
};
