"use client";

import NavBar from "@/components/ui/NavBar";
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
			<NavBar />
			<div className="flex flex-col items-center px-4">
				<div className="flex flex-col items-center">
					<div className="flex mt-2 items-center">
						<div className="indicator">
							{textValue.length > 0 && (
								<span className="indicator-item badge badge-primary" />
							)}
							<h1
								className={cn(
									"font-bold indicator-end text-xl text-center mr-2 flex-1 cursor-pointer decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
									isDateChanged() === true && "text-gray-500",
								)}
								onClick={handleRestoreToday}
							>
								{dayOfTheWeek} - {dateAndMonth}
							</h1>
						</div>
					</div>
					<div className="badge mt-[10px]">
						<h2>Week {getWeekNumber(currentDate)}</h2>
					</div>
				</div>

				<form onSubmit={handleFormSubmit} className="w-full">
					<textarea
						className={cn(
							"mt-[10px] w-full border-2 h-[50px] textarea textarea-ghost border-black",
						)}
						value={textValue}
						onChange={(e) => setTextValue(e.target.value)}
						placeholder={`Notes on ${dayOfTheWeek} ${dateAndMonth}`}
					/>
					<div className="flex gap-4 h-[50px] justify-around mt-2">
						{textValue.length > 0 && (
							<>
								<button className="btn" onClick={handleDeleteNote}>
									Discard
								</button>

								{isSavingNote ? (
									<button className="btn btn-secondary" disabled>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving
									</button>
								) : (
									<button type="submit" className="btn btn-primary">
										Save
									</button>
								)}
							</>
						)}
					</div>
				</form>

				<div className="flex w-full justify-center items-center flex-col gap-4">
					{scheduleForToday.length > 0
						? scheduleForToday.map((course) => (
								<div
									key={course.label}
									className={cn("card bg-base-100 shadow-xl h-fit")}
								>
									<div className="card-body">
										<div className="w-full justify-start flex gap-4">
											<div className="badge badge-outline badge-primary">
												{course.room}
											</div>
											<div className="badge badge-outline badge-secondary flex gap-3 items-center">
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
										<h2 className="card-title font-bold text-xl">
											{course.label}
										</h2>
									</div>
								</div>
							))
						: "No course for today"}
				</div>

				<div className="btm-nav">
					<button className="" onClick={handlePreviousDay}>
						<ChevronLeft />
						<span className="btm-nav-label">{formatDate(prevDay)}</span>
					</button>
					<button className="" onClick={handleNextDay}>
						<ChevronRight />
						<span className="btm-nav-label">{formatDate(nextDay)}</span>
					</button>
				</div>
			</div>
		</>
	);
}
