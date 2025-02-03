"use client"
import CourseItem from "@/components/ui/CourseItem"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { coursePeriods } from "@/lib/course_periods"
import { dayNames } from "@/lib/day-utils"
import type { Course } from "@/model/Course"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@stackframe/stack"
import { Pen, Plus, X } from "lucide-react"
import { type FormEvent, useEffect, useState } from "react"

export default function UserCourses({ queryUserId }: { queryUserId?: string }) {
	const [addCourseFormOpen, setOpenAddCourseForm] = useState(false)
	const [editCourseFormOpen, setOpenEditCourseForm] = useState(false)
	const [courses, setCourses] = useState<Course[]>([])

	const [courseLabelValue, setCourseLabelValue] = useState("")
	const [courseRoomValue, setCourseRoomValue] = useState("")
	const [courseDayIndexValue, setCourseDayIndexValue] = useState("")
	const [courseFromPeriodValue, setCourseFromPeriodValue] = useState<
		string | null
	>(null)
	const [courseToPeriodValue, setCourseToPeriodValue] = useState<string | null>(
		null,
	)

	const [alertDialogOpen, setOpenDeleteAlertDialog] = useState(false)
	const [tempCourse, setTempCourse] = useState<Course | null>(null)

	const supabase = createClient()
	const user = useUser()
	const { toast } = useToast()

	const handleAddCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (courseLabelValue.length < 2) {
			return toast({
				title: "Tên môn học phải có ít nhất 2 ký tự.",
				description: "Please enter a valid course name",
			})
		}

		if (courseRoomValue.length < 2) {
			return toast({
				title: "Phòng học phải có ít nhất 2 ký tự.",
				description: "Please enter a valid room number",
			})
		}

		const courseFromPeriodValueToInt = courseFromPeriodValue
			? Number.parseInt(courseFromPeriodValue)
			: 0
		const courseToPeriodValueToInt = courseToPeriodValue
			? Number.parseInt(courseToPeriodValue)
			: 0
		const courseDayIndexValueToInt = Number.parseInt(courseDayIndexValue)

		const { error } = await supabase.from("course").insert([
			{
				user_id: queryUserId,
				label: courseLabelValue,
				room: courseRoomValue,
				from_period: courseFromPeriodValueToInt,
				to_period: courseToPeriodValueToInt,
				day_index: courseDayIndexValueToInt,
				time_notation: courseFromPeriodValueToInt >= 6 ? "PM" : "AM",
			},
		])

		closeForm()
		fetchUserCourses()

		if (error)
			return toast({
				title: "Failed to add course",
				description: "Server failed due to some error",
			})
		return toast({
			title: `Added ${courseLabelValue}`,
			description: "Successfully added the course",
		})
	}

	const handleDeleteCourse = async () => {
		const { error } = await supabase
			.from("course")
			.delete()
			.eq("id", tempCourse?.id)
		if (error)
			return toast({
				title: "Failed to delete course",
				description: "Server failed due to some error",
			})

		fetchUserCourses()

		return toast({
			title: `Deleted ${tempCourse?.label}`,
			description: "Successfully deleted the course",
		})
	}

	const handleUpdateCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (courseLabelValue.length < 2) {
			return toast({
				title: "Tên môn học phải có ít nhất 2 ký tự.",
				description: "Please enter a valid course name",
			})
		}

		if (courseRoomValue.length < 2) {
			return toast({
				title: "Phòng học phải có ít nhất 2 ký tự.",
				description: "Please enter a valid room number",
			})
		}

		const { error } = await supabase
			.from("course")
			.update({
				label: courseLabelValue,
				room: courseRoomValue,
				from_period: courseFromPeriodValue
					? Number.parseInt(courseFromPeriodValue)
					: tempCourse?.from_period,
				to_period: courseToPeriodValue
					? Number.parseInt(courseToPeriodValue)
					: tempCourse?.to_period,
				day_index: Number.parseInt(courseDayIndexValue),
			})
			.eq("id", tempCourse?.id)
			.select()

		fetchUserCourses()

		if (error)
			return toast({
				title: "Failed to add course",
				description: "Server failed due to some error",
			})

		toast({
			title: `Updated ${courseLabelValue}`,
			description: "Successfully updated the course",
		})

		closeForm()
	}

	useEffect(() => {
		fetchUserCourses()
	}, [])

	const fetchUserCourses = async () => {
		const { data, error } = await supabase
			.from("course")
			.select("*")
			.eq("user_id", queryUserId)

		if (data) setCourses(data)
		if (error)
			return toast({
				title: "Failed to get courses",
				description: error.message,
			})
	}

	const closeForm = () => {
		setCourseLabelValue("")
		setCourseRoomValue("")
		setCourseDayIndexValue("")
		setCourseFromPeriodValue("0")
		setCourseToPeriodValue("0")

		setTempCourse(null)

		setOpenAddCourseForm(false)
		setOpenEditCourseForm(false)
	}

	const groupedCourses = courses.reduce<Record<number, Course[]>>(
		(acc, course) => {
			if (!acc[course.day_index]) {
				acc[course.day_index] = []
			}
			acc[course.day_index].push(course)
			return acc
		},
		{},
	)

	console.log(groupedCourses)

	return (
		<>
			{/* <div className="w-screen flex justify-center items-center"> */}
			{/* 	<Button className="btn btn-active btn-ghost" onClick={fetchUserCourses}> */}
			{/* 		<RefreshCcw /> */}
			{/* 		Refresh courses */}
			{/* 	</Button> */}
			{/* </div> */}
			{user?.id === queryUserId && (
				<Button
					variant="default"
					size="icon"
					className="fixed right-4 bottom-4 rounded-full shadow-lg"
					onClick={() => setOpenAddCourseForm(true)}
				>
					<Plus className="h-4 w-4" />
					<span className="sr-only">Open edit drawer</span>
				</Button>
			)}
			<div className="mt-4 flex flex-col gap-4 p-4">
				{courses.length > 0 ? (
					Object.keys(groupedCourses).map((dayIndex) => (
						<div key={dayIndex} className="flex flex-col gap-2">
							{/* Group title */}
							<h2 className="font-bold text-xl">
								{dayNames[Number.parseInt(dayIndex)]}
							</h2>
							{/* Group items */}
							{groupedCourses[Number.parseInt(dayIndex)]?.map(
								(course: Course) => (
									<div
										className="flex h-fit w-full flex-col gap-2 rounded-lg border-2 border-black bg-base-100 p-3 shadow-xl"
										hidden={user?.id !== queryUserId}
										key={course.label}
									>
										<CourseItem {...course} />

										{user?.id === queryUserId && (
											<div className="my-2 flex justify-around gap-2">
												{/* Delete course button */}
												<Button
													variant="default"
													size="icon"
													className="rounded-full p-2 shadow-lg"
													onClick={() => {
														setTempCourse(course)
														setOpenDeleteAlertDialog(true)
													}}
												>
													<X />
												</Button>
												{/* Edit course button */}
												<Button
													variant="default"
													size="icon"
													className="rounded-full p-2 shadow-lg"
													onClick={() => {
														setTempCourse(course)
														setCourseLabelValue(course.label)
														setCourseRoomValue(course.room)
														setCourseDayIndexValue(course.day_index.toString())
														setCourseFromPeriodValue(
															course.from_period.toString(),
														)
														setCourseToPeriodValue(course.to_period.toString())
														setOpenEditCourseForm(true)
													}}
												>
													<Pen />
												</Button>
											</div>
										)}
									</div>
								),
							)}
						</div>
					))
				) : (
					<div className="flex h-[70vh] w-screen items-center justify-center">
						<div>No courses added</div>
					</div>
				)}
			</div>
			<Dialog open={addCourseFormOpen} onOpenChange={setOpenAddCourseForm}>
				<DialogContent className="h-screen max-w-screen">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							Thêm một khóa học
							<Button
								variant="outline"
								onClick={() => {
									setOpenAddCourseForm(false)
								}}
							>
								<X />
							</Button>
						</DialogTitle>
					</DialogHeader>

					<form
						className="flex flex-col gap-4"
						onSubmit={handleAddCourseSubmit}
					>
						{/* Course's name */}
						<Textarea
							required
							value={courseLabelValue}
							onChange={(e) => setCourseLabelValue(e.target.value)}
							className="max-w-[90vw]"
							placeholder="Tên của môn học"
						/>
						{/* Course's room */}
						<Input
							required
							value={courseRoomValue}
							onChange={(e) => setCourseRoomValue(e.target.value)}
							type="text"
							placeholder="Phòng của môn học"
						/>
						{/* Course's day index */}
						<Select
							required
							defaultValue={courseDayIndexValue ? courseDayIndexValue : "1"}
							onValueChange={(e) => setCourseDayIndexValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Ngày học" />
							</SelectTrigger>
							<SelectContent>
								{dayNames.map((day, index) => (
									<SelectItem
										key={day + index.toString()}
										value={index.toString()}
									>
										{day}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Course's from period */}
						<Select
							required
							defaultValue={courseFromPeriodValue ? courseFromPeriodValue : "1"}
							onValueChange={(e) => setCourseFromPeriodValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Từ tiết" />
							</SelectTrigger>
							<SelectContent>
								{coursePeriods.map((period, index) => (
									<SelectItem
										key={period.label + period.start}
										value={index.toString()}
									>
										{period.label} - {period.start}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Course's to period */}
						<Select
							defaultValue={courseToPeriodValue ? courseToPeriodValue : "0"}
							onValueChange={(e) => setCourseToPeriodValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Tới tiết" />
							</SelectTrigger>
							<SelectContent>
								{coursePeriods
									.slice(1, coursePeriods.length)
									.map((period, index) => (
										<SelectItem
											key={period.label + period.end}
											value={index.toString()}
										>
											{period.label} - {period.end}
										</SelectItem>
									))}
							</SelectContent>
						</Select>

						<Button className="max-w-[90vw]">Thêm môn học</Button>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog open={editCourseFormOpen} onOpenChange={setOpenEditCourseForm}>
				<DialogContent className="h-screen max-w-screen">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							Chỉnh sửa khóa học
							<Button
								variant="outline"
								onClick={() => {
									setOpenEditCourseForm(false)
								}}
							>
								<X />
							</Button>
						</DialogTitle>
					</DialogHeader>
					<form
						className="flex flex-col gap-4"
						onSubmit={handleUpdateCourseSubmit}
					>
						{/* Course's name edit */}
						<Textarea
							required
							value={courseLabelValue ?? tempCourse?.label}
							onChange={(e) => setCourseLabelValue(e.target.value)}
							placeholder="Tên của môn học"
						/>
						{/* Course's room edit */}
						<Input
							required
							value={courseRoomValue ?? tempCourse?.room.toUpperCase()}
							onChange={(e) => setCourseRoomValue(e.target.value)}
							className="max-w-[90vw]"
							placeholder="Phòng của môn học"
						/>
						{/* Course's day index edit */}
						<Select
							required
							defaultValue={courseDayIndexValue ?? tempCourse?.day_index}
							onValueChange={(e) => setCourseDayIndexValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Ngày hoc" />
							</SelectTrigger>
							<SelectContent>
								{dayNames.map((day, index) => (
									<SelectItem
										key={day + index.toString()}
										value={index.toString()}
									>
										{day}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Course's from period edit */}
						<Select
							required
							defaultValue={
								courseFromPeriodValue ?? tempCourse?.from_period.toString()
							}
							onValueChange={(e) => setCourseFromPeriodValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Từ tiết" />
							</SelectTrigger>
							<SelectContent>
								{coursePeriods.map((period, index) => (
									<SelectItem
										key={period.label + period.start}
										value={index.toString()}
									>
										{period.label} - {period.start}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Course's to period edit */}
						<Select
							defaultValue={
								courseToPeriodValue ?? tempCourse?.to_period.toString()
							}
							onValueChange={(e) => setCourseToPeriodValue(e)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Tới tiết" />
							</SelectTrigger>
							<SelectContent>
								{coursePeriods.map((period, index) => (
									<SelectItem
										key={period.label + period.end}
										value={index.toString()}
									>
										{period.label} - {period.end}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button>Lưu chỉnh sửa</Button>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={alertDialogOpen}
				onOpenChange={setOpenDeleteAlertDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this course?</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setTempCourse(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteCourse}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
