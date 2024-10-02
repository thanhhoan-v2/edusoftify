"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/courses";
import {
	cn,
	dayNames,
	formatDate,
	getNextDay,
	getPreviousDay,
	getWeekNumber,
	schedule,
} from "@/lib/utils";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import React from "react";

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
					<div className="flex items-center gap-1">
						<div className="flex flex-col justify-center items-center">
							<h1
								className={cn(
									"font-bold text-xl w-[200px] text-center cursor-pointer decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
									isDateChanged() === true &&
										"text-gray-500 underline decoration-cyan-800 decoration-wavy underline-offset-2",
								)}
								onClick={handleRestoreToday}
							>
								{dayNames[dayIndex]} - {dateAndMonth}
							</h1>
							<p>Week {getWeekNumber(currentDate)}</p>
						</div>
					</div>
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
