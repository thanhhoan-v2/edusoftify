"use client"
import AddCourseDialog from "@/components/dialogs/AddCourseDialog"
import DeleteCourseDialog from "@/components/dialogs/DeleteCourseDialog"
import EditCourseDialog from "@/components/dialogs/EditCourseDialog"
import CourseItem from "@/components/ui/CourseItem"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { dayNames } from "@/lib/day-utils"
import type { Course } from "@/model/Course"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@stackframe/stack"
import { Pen, Plus, X } from "lucide-react"
import { type FormEvent, useEffect, useState } from "react"

export default function UserCourses({ queryUserId }: { queryUserId?: string }) {
	// Form & Dialog states
	const [addCourseFormOpen, setOpenAddCourseForm] = useState(false)
	const [editCourseFormOpen, setOpenEditCourseForm] = useState(false)
	const [alertDialogOpen, setOpenDeleteAlertDialog] = useState(false)

	// Course value states
	const [courses, setCourses] = useState<Course[]>([])
	const [tempCourse, setTempCourse] = useState<Course | null>(null)
	const [courseLabelValue, setCourseLabelValue] = useState("")
	const [courseRoomValue, setCourseRoomValue] = useState("")
	const [courseDayIndexValue, setCourseDayIndexValue] = useState("")
	const [courseFromPeriodValue, setCourseFromPeriodValue] = useState<
		string | null
	>(null)
	const [courseToPeriodValue, setCourseToPeriodValue] = useState<string | null>(
		null,
	)

	const supabase = createClient()
	const user = useUser()
	const { toast } = useToast()

	const courseFromPeriodValueToInt = courseFromPeriodValue
		? Number.parseInt(courseFromPeriodValue)
		: 0
	const courseToPeriodValueToInt = courseToPeriodValue
		? Number.parseInt(courseToPeriodValue)
		: 0
	const courseDayIndexValueToInt = Number.parseInt(courseDayIndexValue)
	const dialogContentClassName =
		"max-w-[90vw] max-h-[calc(100dvh)] overflow-auto rounded-lg"

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
				time_notation: courseFromPeriodValueToInt >= 6 ? "PM" : "AM",
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
			.order("day_index", { ascending: true })

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

	const coursesGroupedByDayIndex = courses.reduce<Record<number, Course[]>>(
		(acc, course) => {
			if (!acc[course.day_index]) {
				acc[course.day_index] = []
			}
			acc[course.day_index].push(course)
			return acc
		},
		{},
	)

	return (
		<>
			{user?.id === queryUserId && (
				<Button
					variant="default"
					size="icon"
					className="fixed right-4 bottom-4 rounded-full shadow-lg"
					onClick={() => {
						// Resets the input states
						setCourseToPeriodValue("0")
						setCourseFromPeriodValue("0")
						setCourseDayIndexValue("1")
						setCourseLabelValue("")
						setCourseRoomValue("")

						setOpenAddCourseForm(true)
					}}
				>
					<Plus className="h-4 w-4" />
					<span className="sr-only">Open add course form</span>
				</Button>
			)}
			<div className="mt-4 flex flex-col gap-4 p-4">
				{courses.length > 0 ? (
					Object.keys(coursesGroupedByDayIndex).map((dayIndex) => (
						<div key={dayIndex} className="flex flex-col gap-2">
							{/* Group title */}
							<h2 className="font-bold text-xl">
								{dayNames[Number.parseInt(dayIndex)]}
							</h2>
							{/* Group items */}
							{coursesGroupedByDayIndex[Number.parseInt(dayIndex)]?.map(
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

			<AddCourseDialog
				open={addCourseFormOpen}
				onOpenChange={setOpenAddCourseForm}
				onSubmit={handleAddCourseSubmit}
				courseLabelValue={courseLabelValue}
				setCourseLabelValue={setCourseLabelValue}
				courseRoomValue={courseRoomValue}
				setCourseRoomValue={setCourseRoomValue}
				courseDayIndexValue={courseDayIndexValue}
				setCourseDayIndexValue={setCourseDayIndexValue}
				courseFromPeriodValue={courseFromPeriodValue}
				setCourseFromPeriodValue={setCourseFromPeriodValue}
				courseToPeriodValue={courseToPeriodValue}
				setCourseToPeriodValue={setCourseToPeriodValue}
				contentClassName={dialogContentClassName}
			/>

			<EditCourseDialog
				open={editCourseFormOpen}
				onOpenChange={setOpenEditCourseForm}
				onSubmit={handleUpdateCourseSubmit}
				tempCourse={tempCourse}
				courseLabelValue={courseLabelValue}
				setCourseLabelValue={setCourseLabelValue}
				courseRoomValue={courseRoomValue}
				setCourseRoomValue={setCourseRoomValue}
				courseDayIndexValue={courseDayIndexValue}
				setCourseDayIndexValue={setCourseDayIndexValue}
				courseFromPeriodValue={courseFromPeriodValue}
				setCourseFromPeriodValue={setCourseFromPeriodValue}
				courseToPeriodValue={courseToPeriodValue}
				setCourseToPeriodValue={setCourseToPeriodValue}
				contentClassName={dialogContentClassName}
			/>

			<DeleteCourseDialog
				open={alertDialogOpen}
				onOpenChange={setOpenDeleteAlertDialog}
				onDelete={handleDeleteCourse}
				onCancel={() => setTempCourse(null)}
			/>
		</>
	)
}
