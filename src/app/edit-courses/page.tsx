"use client";
import CourseItem from "@/components/ui/CourseItem";
import NavBar from "@/components/ui/NavBar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { coursePeriods } from "@/lib/course_periods";
import { dayNames } from "@/lib/utils";
import type { Course } from "@/model/Course";
import { createClient } from "@/utils/supabase/client";
import { useStackApp } from "@stackframe/stack";
import { Pen, Plus, RefreshCcw, X } from "lucide-react";
import { type FormEvent, useEffect } from "react";
import { useState } from "react";

export default function EditCoursesPage() {
	const [addCourseFormOpen, setOpenAddCourseForm] = useState(false);
	const [editCourseFormOpen, setOpenEditCourseForm] = useState(false);
	const [courses, setCourses] = useState<Course[]>([]);

	const [courseLabelValue, setCourseLabelValue] = useState("");
	const [courseRoomValue, setCourseRoomValue] = useState("");
	const [courseDayIndexValue, setCourseDayIndexValue] = useState("");
	const [courseFromPeriodValue, setCourseFromPeriodValue] = useState<
		string | null
	>(null);
	const [courseToPeriodValue, setCourseToPeriodValue] = useState<string | null>(
		null,
	);

	const [alertDialogOpen, setOpenDeleteAlertDialog] = useState(false);
	const [tempCourse, setTempCourse] = useState<Course | null>(null);

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

		const { error } = await supabase.from("course").insert([
			{
				user_id: user?.id,
				label: courseLabelValue,
				room: courseRoomValue,
				from_period: courseFromPeriodValue
					? Number.parseInt(courseFromPeriodValue)
					: 0,
				to_period: courseToPeriodValue
					? Number.parseInt(courseToPeriodValue)
					: 0,
				day_index: Number.parseInt(courseDayIndexValue),
			},
		]);

		closeForm();
		fetchUserCourses();

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
			.eq("id", tempCourse?.id);

		if (error)
			return toast({
				title: "Failed to delete course",
				description: "Server failed due to some error",
			});

		fetchUserCourses();

		return toast({
			title: `Deleted ${tempCourse?.label}`,
			description: "Successfully deleted the course",
		});
	};

	const handleUpdateCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (courseLabelValue.length < 3) {
			return toast({
				title: "Course name must have at least 3 characters.",
				description: "Please enter a valid course name",
			});
		}

		if (courseRoomValue.length < 3) {
			return toast({
				title: "Room number must have at least 3 characters.",
				description: "Please enter a valid room number",
			});
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
			.select();

		fetchUserCourses();

		if (error)
			return toast({
				title: "Failed to add course",
				description: "Server failed due to some error",
			});

		toast({
			title: `Updated ${courseLabelValue}`,
			description: "Successfully updated the course",
		});

		closeForm();
	};

	useEffect(() => {
		fetchUserCourses();
	}, []);

	const fetchUserCourses = async () => {
		const { data, error } = await supabase
			.from("course")
			.select("*")
			.eq("user_id", user?.id);

		if (data) setCourses(data);
		if (error)
			return toast({
				title: "Failed to get courses",
				description: error.message,
			});
	};

	const closeForm = () => {
		setCourseLabelValue("");
		setCourseRoomValue("");
		setCourseDayIndexValue("");
		setCourseFromPeriodValue("0");
		setCourseToPeriodValue("0");

		setTempCourse(null);

		setOpenAddCourseForm(false);
		setOpenEditCourseForm(false);
	};

	const groupedCourses = courses.reduce<Record<number, Course[]>>(
		(acc, course) => {
			if (!acc[course.day_index]) {
				acc[course.day_index] = [];
			}
			acc[course.day_index].push(course);
			return acc;
		},
		{},
	);

	return (
		<>
			<NavBar title="Edit Courses" />

			{/* <div className="w-screen flex justify-center items-center"> */}
			{/* 	<Button className="btn btn-active btn-ghost" onClick={fetchUserCourses}> */}
			{/* 		<RefreshCcw /> */}
			{/* 		Refresh courses */}
			{/* 	</Button> */}
			{/* </div> */}

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
					Object.keys(groupedCourses).map((dayIndex) => (
						<div key={dayIndex} className="flex flex-col gap-2">
							{/* Group title */}
							<h2 className="font-bold text-xl">
								{dayNames[Number.parseInt(dayIndex)]}
							</h2>
							{/* Group items */}
							{groupedCourses[Number.parseInt(dayIndex)].map(
								(course: Course) => (
									<div
										className="flex flex-col gap-2 card bg-base-100 w-full border-2 border-black shadow-xl h-fit"
										key={course.label}
									>
										<CourseItem {...course} />
										<div className="self-center my-2 gap-2 flex">
											{/* Delete course button */}
											<Button
												variant="default"
												size="icon"
												className="rounded-full p-2 shadow-lg"
												onClick={() => {
													setTempCourse(course);
													setOpenDeleteAlertDialog(true);
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
													setTempCourse(course);
													setCourseLabelValue(course.label);
													setCourseRoomValue(course.room);
													setCourseDayIndexValue(course.day_index.toString());
													setCourseFromPeriodValue(
														course.from_period.toString(),
													);
													setCourseToPeriodValue(course.to_period.toString());
													setOpenEditCourseForm(true);
												}}
											>
												<Pen />
											</Button>
										</div>
									</div>
								),
							)}
						</div>
					))
				) : (
					<div className="w-screen h-[70vh] flex justify-center items-center">
						<div>No courses added</div>
					</div>
				)}
			</div>

			<Drawer open={addCourseFormOpen} onOpenChange={setOpenAddCourseForm}>
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
									<option value={index}>{day}</option>
								))}
							</select>

							{/* Course's from period */}
							<select
								required
								className="select select-bordered w-full"
								value={courseFromPeriodValue ? courseFromPeriodValue : 0}
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
								value={courseToPeriodValue ? courseToPeriodValue : 0}
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

			{/* Edit course form */}
			<Drawer open={editCourseFormOpen} onOpenChange={setOpenEditCourseForm}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Chỉnh sửa khóa học</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter>
						<form
							className="flex flex-col gap-4"
							onSubmit={handleUpdateCourseSubmit}
						>
							{/* Course's name */}
							<label className="input input-bordered flex items-center gap-2">
								Name
								<input
									required
									value={courseLabelValue ?? tempCourse?.label}
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
									value={courseRoomValue ?? tempCourse?.room.toUpperCase()}
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
								value={courseDayIndexValue ?? tempCourse?.day_index}
								onChange={(e) => setCourseDayIndexValue(e.target.value)}
							>
								<option disabled selected>
									Học ngày nào ?
								</option>
								{dayNames.map((day, index) => (
									<option value={index}>{day}</option>
								))}
							</select>

							{/* Course's from period */}
							<select
								required
								className="select select-bordered w-full"
								value={courseFromPeriodValue ?? tempCourse?.from_period}
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
								value={courseToPeriodValue ?? tempCourse?.to_period}
								onChange={(e) => setCourseToPeriodValue(e.target.value)}
							>
								<option disabled selected>
									Tới tiết mấy ?
								</option>
								{coursePeriods.map((period, index) => (
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
	);
}
