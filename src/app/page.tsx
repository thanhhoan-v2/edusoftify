"use client"

import DayNoteDrawer from "@/components/DayNoteDrawer"
import { PageHeader } from "@/components/PageHeader"
import UserCourses from "@/components/UserCourses"
import { AnimatedText } from "@/components/animated-text"
import { ChatBubble } from "@/components/chat-bubble"
import CourseItem from "@/components/ui/CourseItem"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { dayNames } from "@/lib/day-utils"
import { cn, formatDate, getNextDay, getPreviousDay } from "@/lib/utils"
import type { Course } from "@/model/Course"
import { createDayNote, updateDayNote } from "@/queries/client/dayNote"
import { createClient } from "@/utils/supabase/client"
import { useStackApp } from "@stackframe/stack"
import { MoveLeft, MoveRight, Pen } from "lucide-react"
import Head from "next/head"
import React, { useEffect } from "react"

export default function HomePage() {
	const app = useStackApp()
	const supabase = createClient()
	const user = app.useUser()
	const { toast } = useToast()

	const [courses, setCourses] = React.useState<Course[]>([])
	const [noteDrawerOpen, setNoteDrawerOpen] = React.useState(false)

	const initialDate = new Date()
	const [currentDate, setCurrentDate] = React.useState(new Date())
	const [dayIndex, setDayIndex] = React.useState(new Date().getDay())
	const [dateAndMonth, setDateAndMonth] = React.useState(
		formatDate(currentDate),
	)

	const [dayNote, setDayNote] = React.useState("")
	const [fetchedDayNoteId, setFetchedDayNoteId] = React.useState(null)
	const [isSavingNote, setDayNoteSavingStatus] = React.useState(false)

	const prevDay = getPreviousDay(currentDate)
	const nextDay = getNextDay(currentDate)
	const dayOfTheWeek = dayNames[dayIndex]

	useEffect(() => {
		if (user) fetchUserCourses()
	}, [])

	const fetchUserCourses = async () => {
		const { data, error } = await supabase
			.from("course")
			.select("*")
			.eq("user_id", user?.id)
		if (data) {
			setCourses(data)
		}
		if (error) {
			toast({
				title: "Failed to get courses",
				description: error.message,
			})
		}
	}

	const handleDayNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setDayNoteSavingStatus(true)

		if (dayNote.length > 0 && fetchedDayNoteId) {
			const { data, error } = await updateDayNote(dayNote, fetchedDayNoteId)
			if (error) {
				return toast({
					title: "Failed to update note",
					description: error.message,
				})
			}
			if (data) {
				setDayNoteSavingStatus(false)
			}
		} else {
			const { data, error } = await createDayNote(dayNote, currentDate)
			if (error) {
				return toast({
					title: "Failed to save note",
					description: error.message,
				})
			}
		}
	}

	const handleDeleteDayNote = async () => {
		const { error } = await supabase
			.from("day_notes")
			.delete()
			.eq("id", fetchedDayNoteId)
		setDayNote("")
		if (error) {
			return toast({
				title: "Failed to delete note",
				description: error.message,
			})
		}
	}

	const handlePreviousDay = () => {
		const previousDate = getPreviousDay(currentDate)
		setCurrentDate(previousDate)
		setDayIndex((dayIndex - 1 + 7) % 7)
		setDateAndMonth(formatDate(previousDate))
	}

	const handleNextDay = () => {
		const nextDate = getNextDay(currentDate)
		setCurrentDate(nextDate)
		setDayIndex((dayIndex + 1) % 7)
		setDateAndMonth(formatDate(nextDate))
	}

	const handleRestoreToday = () => {
		setCurrentDate(initialDate)
		setDayIndex(initialDate.getDay())
		setDateAndMonth(formatDate(initialDate))
	}

	const isDateChanged = () => {
		return currentDate.toDateString() !== initialDate.toDateString()
	}

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
			</Head>

			<PageHeader title="Home" />

			<div className="flex flex-col items-center px-4">
				{user && (
					<div className="flex flex-col items-center">
						<div className="mt-2 flex items-center">
							<div
								className={cn(
									"my-[30px] mr-2 flex-1 cursor-pointer text-center font-bold text-xl decoration-pink-400 underline-offset-4 hover:underline hover:decoration-wavy",
									isDateChanged() === true && "text-gray-500",
								)}
								onClick={handleRestoreToday}
							>
								{dayOfTheWeek} - {dateAndMonth}
							</div>
						</div>
					</div>
				)}

				{user ? (
					<>
						<UserCourses userId={user.id} setCourses={setCourses} />
						<div className="mt-2 flex w-full flex-col items-center justify-center gap-4">
							{courses.length > 0 ? (
								courses
									.filter((course) => course.day_index === dayIndex)
									.map((course) => (
										<CourseItem {...course} key={course.label} />
									))
							) : (
								<div className="card flex h-[50vh] w-full items-center justify-center">
									<div className="card-title">No course for today</div>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="flex h-[80vh] flex-col items-center justify-center">
						<AnimatedText title="Edusoftify" subtitle="For Edusoft Haters" />
					</div>
				)}
			</div>

			{user && (
				<div className="mt-[40px] ml-[20px]">
					<ChatBubble message={dayNote} avatarUrl={user?.profileImageUrl}>
						<Button
							className="mt-3"
							variant="ghost"
							onClick={() => setNoteDrawerOpen(true)}
						>
							<Pen size={20} />
							Edit
						</Button>
					</ChatBubble>
				</div>
			)}

			{user && (
				<div className="fixed bottom-2 flex w-full justify-around gap-2 p-2">
					<Button className="w-full" onClick={handlePreviousDay}>
						<div className="flex items-center self-center">
							<MoveLeft />
							&nbsp;
							<span>{formatDate(prevDay)}</span>
						</div>
					</Button>
					<Button className="w-full" onClick={handleNextDay}>
						<div className="flex items-center self-center">
							<span>{formatDate(nextDay)}</span>
							&nbsp;
							<MoveRight />
						</div>
					</Button>
				</div>
			)}

			<DayNoteDrawer
				noteDrawerOpen={noteDrawerOpen}
				setNoteDrawerOpen={setNoteDrawerOpen}
				dayNote={dayNote}
				setDayNote={setDayNote}
				isSavingNote={isSavingNote}
				handleDayNoteSubmit={handleDayNoteSubmit}
				handleDeleteDayNote={handleDeleteDayNote}
				dayOfTheWeek={dayOfTheWeek}
				dateAndMonth={dateAndMonth}
			/>
		</>
	)
}
