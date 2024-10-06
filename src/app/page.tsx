"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { createClient } from "@/utils/supabase/client";
import {
	ChevronLeft,
	ChevronRight,
	CircleAlert,
	Loader2,
	Moon,
	Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
	const supabase = createClient();
	const router = useRouter();

	const initialDate = new Date();
	const [currentDate, setCurrentDate] = React.useState(new Date());
	const [dayIndex, setDayIndex] = React.useState(new Date().getDay());
	const [dateAndMonth, setDateAndMonth] = React.useState(
		formatDate(currentDate),
	);

	const [textValue, setTextValue] = React.useState("");
	const [fetchedTextValueId, setFetchedTextValueId] = React.useState(null);
	const [isSavingNote, setNoteSavingStatus] = React.useState(false);

	React.useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase
				.from("descriptions")
				.select()
				.eq("onDate", currentDate.toISOString().slice(0, 10));
			if (data && data?.length > 0) {
				setTextValue(data[0]?.value);
				setFetchedTextValueId(data[0]?.id);
			} else {
				setTextValue("");
				setFetchedTextValueId(null);
			}
		};
		fetchData();
	}, [currentDate]);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setNoteSavingStatus(true);

		if (textValue.length > 0 && fetchedTextValueId) {
			// UPDATE existing note
			const { data, error } = await supabase
				.from("descriptions")
				.update({ value: textValue })
				.eq("id", fetchedTextValueId)
				.select();
			if (data) {
				setNoteSavingStatus(false);
			}
		} else {
			// CREATE new note
			const { data, error } = await supabase
				.from("descriptions")
				.insert([
					{
						value: textValue,
						onDate: currentDate,
					},
				])
				.select();
			if (data) {
				setFetchedTextValueId(data[0].id);
				setNoteSavingStatus(false);
			}
		}
	};

	const handleDeleteNote = async () => {
		const { data, error } = await supabase
			.from("descriptions")
			.delete()
			.eq("id", fetchedTextValueId);

		setTextValue("");
	};

	const prevDay = getPreviousDay(currentDate);
	const nextDay = getNextDay(currentDate);
	const dayOfTheWeek = dayNames[dayIndex];

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
			<div className="h-screen flex flex-col items-center px-4">
				<div className="flex flex-col items-center mt-[30px]">
					<div className="flex items-center">
						<h1
							className={cn(
								"font-bold text-xl text-center mr-2 flex-1 cursor-pointer decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
								isDateChanged() === true && "text-gray-500",
							)}
							onClick={handleRestoreToday}
						>
							{dayOfTheWeek} - {dateAndMonth}
						</h1>
						{textValue.length > 0 && <CircleAlert color="red" />}
					</div>
					<Badge variant="outline" className="mt-[10px]">
						Week {getWeekNumber(currentDate)}
					</Badge>
				</div>

				<form onSubmit={handleFormSubmit} className="w-full">
					<Textarea
						className={cn("mt-[10px] border-2 h-[100px] border-black")}
						value={textValue}
						onChange={(e) => setTextValue(e.target.value)}
						placeholder={`Notes on ${dayOfTheWeek} ${dateAndMonth}`}
					/>
					<div className="flex gap-4 justify-around w-full mt-2 h-[50px]">
						{textValue.length > 0 && (
							<>
								<Button
									variant="outline"
									className="w-full"
									onClick={handleDeleteNote}
								>
									Discard
								</Button>

								{isSavingNote ? (
									<Button disabled>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving
									</Button>
								) : (
									<Button type="submit" className="w-full">
										Save
									</Button>
								)}
							</>
						)}
					</div>
				</form>

				<div className="flex justify-center items-center flex-col gap-4 h-[50%]">
					{scheduleForToday.length > 0
						? scheduleForToday.map((course) => (
								<div
									key={course.label}
									className={cn(
										"flex flex-col justify-center items-center border-black w-[300px] border-4 border-dotted p-3 rounded-lg gap-4 text-center",
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

				<div className="flex absolute bottom-0 justify-center items-center gap-8 h-[100px]">
					<Button variant="default" onClick={handlePreviousDay}>
						<ChevronLeft /> {formatDate(prevDay)}
					</Button>
					<Button variant="default" onClick={handleNextDay}>
						{formatDate(nextDay)} <ChevronRight />
					</Button>
				</div>
			</div>
		</>
	);
}
