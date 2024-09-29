"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import React from "react";

const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const schedule: { [key: number]: Course[] } = {
	0: [],
	1: [MobileApplicationLab],
	2: [MobileApplication],
	3: [SecurityManagement, ITProject],
	4: [],
	5: [SecurityManagementLab, WebDev],
	6: [WebDevLab],
};

export default function Home() {
	const initialDate = new Date();
	const [currentDate, setCurrentDate] = React.useState(new Date());
	const [dayIndex, setDayIndex] = React.useState(new Date().getDay());
	const [dateAndMonth, setDateAndMonth] = React.useState(
		formatDate(currentDate),
	);

	const scheduleForToday: Course[] = schedule[dayIndex];

	const handlePreviousDay = () => {
		const previousDate = getPreviousDay(currentDate);
		setCurrentDate(previousDate);
		setDayIndex((dayIndex - 1 + 7) % 7);
		setDateAndMonth(formatDate(previousDate));
	};

	const handleNextDay = () => {
		const nextDate = getNextDay(currentDate);
		setCurrentDate(nextDate);
		setDayIndex((dayIndex + 1) % 7);
		setDateAndMonth(formatDate(nextDate));
	};

	const handleRestoreToday = () => {
		const today = new Date();
		setCurrentDate(today);
		setDayIndex(today.getDay());
		setDateAndMonth(formatDate(today));
	};

	const isDateChanged = () =>
		initialDate.toDateString() !== currentDate.toDateString();

	return (
		<>
			<div className="h-screen flex flex-col justify-center items-center">
				<div className="flex justify-center items-center gap-5 h-[100px]">
					<Button variant="outline" onClick={handlePreviousDay}>
						<ChevronLeft />
					</Button>
					<h1
						className={cn(
							"font-bold text-xl w-[200px] text-center cursor-pointer decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
							isDateChanged() === true && "text-gray-500",
						)}
						onClick={handleRestoreToday}
					>
						{dayNames[dayIndex]} - {dateAndMonth}
					</h1>
					<Button variant="outline" onClick={handleNextDay}>
						<ChevronRight />
					</Button>
				</div>

				<div className="flex justify-center items-center gap-3 h-[150px] w-[400px] mt-[50px]">
					{scheduleForToday.length > 0
						? scheduleForToday.map((course) => (
								<div
									key={course.label}
									className={cn(
										"flex flex-col justify-center items-center border-black border-4 border-dotted p-3 rounded-lg gap-4 text-center",
										course.isLab && "border-green-400",
									)}
								>
									<h2 className="font-bold text-xl">{course.label}</h2>
									<Badge>{course.room}</Badge>
									<div className="flex gap-3 items-center">
										{course.timeNotation === "AM" ? (
											<Sun size={15} />
										) : (
											<Moon size={15} />
										)}
										<h4 className="font-bold">
											{course.from} - {course.to}
										</h4>
									</div>
								</div>
							))
						: "No course for today"}
				</div>
			</div>
		</>
	);
}

const formatDate = (date: Date) => {
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "numeric",
	});
};

const getNextDay = (date: Date) => {
	const nextDay = new Date(date);
	nextDay.setDate(date.getDate() + 1);
	return nextDay;
};

const getPreviousDay = (date: Date) => {
	const previousDay = new Date(date);
	previousDay.setDate(date.getDate() - 1);
	return previousDay;
};
