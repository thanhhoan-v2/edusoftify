"use client";
import CourseItem from "@/components/ui/CourseItem";
import NavBar from "@/components/ui/NavBar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { coursePeriods } from "@/lib/course_periods";
import { dayNames } from "@/lib/utils";
import type { Course } from "@/model/Course";
import { createClient } from "@/utils/supabase/client";
import { useStackApp, useUser } from "@stackframe/stack";
import { Minus, Plus, X } from "lucide-react";
import { type FormEvent, FormEventHandler, useEffect } from "react";
import { useState } from "react";

export default function EditCoursesPage() {
	const [open, setOpenAddCourseForm] = useState(false);
	const [courses, setCourses] = useState<Course[]>([]);

	const [courseLabelValue, setCourseLabelValue] = useState("");
	const [courseRoomValue, setCourseRoomValue] = useState("");
	const [courseDayIndexValue, setCourseDayIndexValue] = useState("");
	const [courseFromPeriodValue, setCourseFromPeriodValue] = useState("0");
	const [courseToPeriodValue, setCourseToPeriodValue] = useState("0");

	const [alertDialogOpen, setOpenAlertDialog] = useState(false);
	const [courseIdTobeDeleted, setCourseIdTobeDeleted] = useState<{
		label: string;
		id: string;
	}>();

	const supabase = createClient();
	const app = useStackApp();
	const user = app.useUser();
	const { toast } = useToast();

	const handleAddCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (courseLabelValue.length < 5) {
			return toast({
				title: "Course name must have at least 5 characters.",
				description: "Please enter a valid course name",
			});
		}

		if (courseRoomValue.length < 5) {
			return toast({
				title: "Room number must have at least 4 characters.",
				description: "Please enter a valid room number",
			});
		}

		const { data, error } = await supabase.from("course").insert([
			{
				user_id: user?.id,
				label: courseLabelValue,
				room: courseRoomValue,
				from_period: Number.parseInt(courseFromPeriodValue),
				to_period: Number.parseInt(courseToPeriodValue),
				day_index: Number.parseInt(courseDayIndexValue),
			},
		]);

		closeForm();

		if (error)
			return toast({
				title: "Failed to add course",
				description: "Server failed due to some error",
			});
		return toast({
			title: `Added ${courseLabelValue}`,
			description: "Successfully added the course",
		});
	};

	const handleDeleteCourse = async () => {
		const { error } = await supabase
			.from("course")
			.delete()
			.eq("id", courseIdTobeDeleted?.id);

		if (error)
			return toast({
				title: "Failed to delete course",
				description: "Server failed due to some error",
			});

		return toast({
			title: `Deleted ${courseIdTobeDeleted?.label}`,
			description: "Successfully deleted the course",
		});
	};

	useEffect(() => {
		const fetchUserCourses = async () => {
			const { data, error } = await supabase
				.from("course")
				.select("*")
				.eq("user_id", user?.id);

			if (data) setCourses(data);
		};

		fetchUserCourses();
	}, [handleDeleteCourse, handleAddCourseSubmit]);

	const closeForm = () => {
		setCourseLabelValue("");
		setCourseRoomValue("");
		setCourseDayIndexValue("");
		setCourseFromPeriodValue("0");
		setCourseToPeriodValue("0");
		setOpenAddCourseForm(false);
	};

	return (
		<>
			<NavBar title="Edit Courses" />

			<Button
				variant="default"
				size="icon"
				className="fixed bottom-4 right-4 rounded-full shadow-lg"
				onClick={() => setOpenAddCourseForm(true)}
			>
				<Plus className="h-4 w-4" />
				<span className="sr-only">Open edit drawer</span>
			</Button>

			<div className="flex flex-col gap-4 mt-4 p-4">
				{courses.length > 0 ? (
					courses.map((course) => (
						<div className="flex gap-2">
							<CourseItem {...course} key={course.label} />

							<Button
								variant="default"
								size="icon"
								className="self-center rounded-full p-2 shadow-lg"
								onClick={() => {
									setCourseIdTobeDeleted({
										label: course.label,
										id: course.id,
									});
									setOpenAlertDialog(true);
								}}
							>
								<X />
							</Button>
						</div>
					))
				) : (
					<div className="w-screen h-[70vh] flex justify-center items-center">
						<div>No courses added</div>
					</div>
				)}
			</div>

			<Drawer open={open} onOpenChange={setOpenAddCourseForm}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Thêm một khóa học</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter>
						<form
							className="flex flex-col gap-4"
							onSubmit={handleAddCourseSubmit}
						>
							{/* Course's name */}
							<label className="input input-bordered flex items-center gap-2">
								Name
								<input
									required
									value={courseLabelValue}
									onChange={(e) => setCourseLabelValue(e.target.value)}
									type="text"
									className="grow"
									placeholder="Tên của môn học"
								/>
							</label>
							{/* Course's room */}
							<label className="input input-bordered flex items-center gap-2">
								Room
								<input
									required
									value={courseRoomValue}
									onChange={(e) => setCourseRoomValue(e.target.value)}
									type="text"
									className="grow"
									placeholder="Phòng của môn học"
								/>
							</label>
							{/* Course's day index */}
							<select
								required
								className="select select-bordered w-full"
								value={courseDayIndexValue}
								onChange={(e) => setCourseDayIndexValue(e.target.value)}
							>
								<option disabled selected>
									Học ngày nào ?
								</option>
								{dayNames.map((day, index) => (
									<option value={index + 1}>{day}</option>
								))}
							</select>

							{/* Course's from period */}
							<select
								required
								className="select select-bordered w-full"
								value={courseFromPeriodValue}
								onChange={(e) => setCourseFromPeriodValue(e.target.value)}
							>
								<option disabled selected>
									Từ tiết mấy ?
								</option>
								{coursePeriods.map((period, index) => (
									<option value={index}>
										{period.label} - {period.start}
									</option>
								))}
							</select>
							{/* Course's to period */}
							<select
								className="select select-bordered w-full"
								value={courseToPeriodValue}
								onChange={(e) => setCourseToPeriodValue(e.target.value)}
							>
								<option disabled selected>
									Tới tiết mấy ?
								</option>
								{coursePeriods
									.slice(1, coursePeriods.length)
									.map((period, index) => (
										<option value={index}>
											{period.label} - {period.end}
										</option>
									))}
							</select>

							<Button>Submit</Button>
						</form>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<AlertDialog open={alertDialogOpen} onOpenChange={setOpenAlertDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this course?</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() =>
								setCourseIdTobeDeleted({
									label: "",
									id: "",
								})
							}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteCourse}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
