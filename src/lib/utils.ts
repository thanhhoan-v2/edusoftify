import {
	type Course,
	ITProject,
	MobileApplication,
	MobileApplicationLab,
	SecurityManagement,
	SecurityManagementLab,
	WebDev,
	WebDevLab,
} from "@/lib/courses";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const schedule: { [key: number]: Course[] } = {
	0: [],
	1: [MobileApplicationLab],
	2: [MobileApplication],
	3: [SecurityManagement, ITProject],
	4: [],
	5: [SecurityManagementLab, WebDev],
	6: [WebDevLab],
};

export const weekRanges = new Map<string, { start: Date; end: Date }>([
	["01", { start: new Date("2024-09-02"), end: new Date("2024-09-08") }],
	["02", { start: new Date("2024-09-09"), end: new Date("2024-09-15") }],
	["03", { start: new Date("2024-09-16"), end: new Date("2024-09-22") }],
	["04", { start: new Date("2024-09-23"), end: new Date("2024-09-29") }],
	["05", { start: new Date("2024-09-30"), end: new Date("2024-10-06") }],
	["06", { start: new Date("2024-10-07"), end: new Date("2024-10-13") }],
	["07", { start: new Date("2024-10-14"), end: new Date("2024-10-20") }],
	["08", { start: new Date("2024-10-21"), end: new Date("2024-10-27") }],
	["09", { start: new Date("2024-10-28"), end: new Date("2024-11-03") }],
	["10", { start: new Date("2024-11-04"), end: new Date("2024-11-10") }],
	["11", { start: new Date("2024-11-11"), end: new Date("2024-11-17") }],
	["12", { start: new Date("2024-11-18"), end: new Date("2024-11-24") }],
	["13", { start: new Date("2024-11-25"), end: new Date("2024-12-01") }],
	["14", { start: new Date("2024-12-02"), end: new Date("2024-12-08") }],
	["15", { start: new Date("2024-12-09"), end: new Date("2024-12-15") }],
	["16", { start: new Date("2024-12-16"), end: new Date("2024-12-22") }],
	["17", { start: new Date("2024-12-23"), end: new Date("2024-12-29") }],
	["18", { start: new Date("2024-12-30"), end: new Date("2025-01-05") }],
	["19", { start: new Date("2025-01-06"), end: new Date("2025-01-12") }],
	["20", { start: new Date("2025-01-13"), end: new Date("2025-01-19") }],
]);

export const formatDate = (date: Date) =>
	date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "numeric",
	});

export const getNextDay = (date: Date) => {
	const nextDay = new Date(date);
	nextDay.setDate(date.getDate() + 1);
	return nextDay;
};

export const getPreviousDay = (date: Date) => {
	const previousDay = new Date(date);
	previousDay.setDate(date.getDate() - 1);
	return previousDay;
};

export const getWeekNumber = (date: Date): string | null => {
	let weekNumber: string | null = null;
	let previousWeekNumber: string | null = null;

	weekRanges.forEach((range, week) => {
		if (date >= range.start && date <= range.end) weekNumber = week;
		// Track the previous week number
		if (date > range.end) previousWeekNumber = week;
	});

	// Use the previous week's number if it's Sunday
	if (date.getDay() === 0 && !weekNumber) weekNumber = previousWeekNumber;

	return weekNumber;
};
