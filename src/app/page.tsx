"use client";

import CourseItem from "@/components/ui/CourseItem";
import NavBar from "@/components/ui/NavBar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import {
	cn,
	dayNames,
	formatDate,
	getNextDay,
	getPreviousDay,
	getWeekNumber,
} from "@/lib/utils";
import type { Course } from "@/model/Course";
import { createClient } from "@/utils/supabase/client";
import { useStackApp } from "@stackframe/stack";
import { ChevronLeft, ChevronRight, Loader2, Pen, X } from "lucide-react";
import Head from "next/head";
import React, { useEffect } from "react";

export default function Home() {
	const supabase = createClient();

	const app = useStackApp();
	const user = app.useUser();
	const { toast } = useToast();

	const [courses, setCourses] = React.useState<Course[]>([]);
	const [noteDrawerOpen, setNoteDrawerOpen] = React.useState(false);

	const initialDate = new Date();
	const [currentDate, setCurrentDate] = React.useState(new Date());
	const [dayIndex, setDayIndex] = React.useState(new Date().getDay());
	const [dateAndMonth, setDateAndMonth] = React.useState(
		formatDate(currentDate),
	);

	const [dayNote, setDayNote] = React.useState("");
	const [fetchedDayNoteId, setFetchedDayNoteId] = React.useState(null);
	const [isSavingNote, setDayNoteSavingStatus] = React.useState(false);

	useEffect(() => {
		fetchUserCourses();
	}, []);

	// Fetch all user's courses based on user's id
	const fetchUserCourses = async () => {
		const { data, error } = await supabase
			.from("course")
			.select("*")
			.eq("user_id", user?.id);
		if (data) {
			setCourses(data);
		}
		if (error)
			return toast({
				title: "Failed to get courses",
				description: error.message,
			});
	};

	const prevDay = getPreviousDay(currentDate);
	const nextDay = getNextDay(currentDate);
	const dayOfTheWeek = dayNames[dayIndex];

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

	// Fetch day note based on the current date
	useEffect(() => {
		const fetchDayNote = async () => {
			const { data, error } = await supabase
				.from("day_notes")
				.select()
				.eq("onDate", currentDate.toISOString().slice(0, 10));

			if (error) {
				return toast({
					title: "Failed to get note",
					description: error.message,
				});
			}

			if (data && data?.length > 0) {
				setDayNote(data[0]?.value);
				setFetchedDayNoteId(data[0]?.id);
			} else {
				setDayNote("");
				setFetchedDayNoteId(null);
			}
		};

		fetchDayNote();
	}, [currentDate]);

	const handleDayNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setDayNoteSavingStatus(true);

		if (dayNote.length > 0 && fetchedDayNoteId) {
			// UPDATE existing note
			const { data, error } = await supabase
				.from("day_notes")
				.update({ value: dayNote })
				.eq("id", fetchedDayNoteId)
				.select();
			if (error) {
				return toast({
					title: "Failed to update note",
					description: error.message,
				});
			}
			if (data) {
				setDayNoteSavingStatus(false);
			}
		} else {
			// CREATE new note
			const { data, error } = await supabase
				.from("day_notes")
				.insert([
					{
						value: dayNote,
						onDate: currentDate,
					},
				])
				.select();

			if (error) {
				return toast({
					title: "Failed to save note",
					description: error.message,
				});
			}

			if (data) {
				setFetchedDayNoteId(data[0].id);
				setDayNoteSavingStatus(false);
			}
		}
	};

	const handleDeleteDayNote = async () => {
		const { error } = await supabase
			.from("day_notes")
			.delete()
			.eq("id", fetchedDayNoteId);

		setDayNote("");

		if (error) {
			return toast({
				title: "Failed to delete note",
				description: error.message,
			});
		}
	};

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			<NavBar title="Edusoftify" />

			<div className="flex flex-col items-center px-4">
				<div className="flex flex-col items-center">
					<div className="flex mt-2 items-center">
						<div className="indicator">
							{dayNote.length > 0 && (
								<span className="indicator-item bg-red-500 badge badge-primary" />
							)}
							<p
								className={cn(
									"font-bold indicator-end text-xl text-center mr-2 flex-1 cursor-pointer decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
									isDateChanged() === true && "text-gray-500",
								)}
								onClick={handleRestoreToday}
							>
								{dayOfTheWeek} - {dateAndMonth}
							</p>
						</div>
					</div>
				</div>

				{user ? (
					<>
						{/* Course list */}
						<div className="flex w-full mt-2 justify-center items-center flex-col gap-4">
							{courses.length > 0 ? (
								courses
									.filter((course) => course.day_index + 1 === dayIndex)
									.map((course) => (
										<CourseItem {...course} key={course.label} />
									))
							) : (
								<div className="card w-full flex justify-center items-center h-[50vh]">
									<div className="card-title">No course for today</div>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="mt-[100px]">
						<p>Please sign in</p>
					</div>
				)}
			</div>

			{user && (
				<div className="chat chat-start mt-4 px-5">
					<div className="chat-image avatar">
						<div className="w-10 rounded-full">
							<img alt="User avatar" src={user?.profileImageUrl ?? ""} />
						</div>
					</div>
					<div className="chat-bubble text-nowrap whitespace-pre-wrap break-words w-full">
						{dayNote.length > 0
							? dayNote
							: "Học hành như cá kho tiêu, kho nhiều thì mặn học nhiều thì ngu."}
					</div>
					<div className="chat-footer flex gap-2 mt-2 ml-2 opacity-70">
						<Button variant="outline" onClick={() => setNoteDrawerOpen(true)}>
							<Pen size={20} />
							Edit
						</Button>
					</div>
				</div>
			)}

			{/* Navigation buttons */}
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

			<Drawer open={noteDrawerOpen} onOpenChange={setNoteDrawerOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Ghi chú</DrawerTitle>
						<DrawerDescription>
							{dayOfTheWeek} - {dateAndMonth}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<form onSubmit={handleDayNoteSubmit} className="w-full">
							<textarea
								className={cn(
									"mt-[10px] w-full h-[60vh] border-2 textarea textarea-ghost border-black",
								)}
								value={dayNote}
								onChange={(e) => setDayNote(e.target.value)}
								placeholder={`Notes on ${dayOfTheWeek} ${dateAndMonth}`}
							/>

							<div className="flex gap-4 h-[50px] justify-around mt-1">
								{dayNote.length > 0 && (
									<DrawerClose className="mt-4 flex justify-between w-screen">
										<Button variant="outline" onClick={handleDeleteDayNote}>
											Delete
										</Button>
										{isSavingNote ? (
											<Button className="btn btn-secondary" disabled>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving
											</Button>
										) : (
											<Button type="submit">Save</Button>
										)}
									</DrawerClose>
								)}
							</div>
						</form>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
