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
import { coursePeriods } from "@/lib/course_periods"
import { dayNames } from "@/lib/day-utils"
import type { Course } from "@/model/Course"
import { X } from "lucide-react"
import type { FormEvent } from "react"

type EditCourseDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (e: FormEvent<HTMLFormElement>) => void
	tempCourse: Course | null
	courseLabelValue: string
	setCourseLabelValue: (value: string) => void
	courseRoomValue: string
	setCourseRoomValue: (value: string) => void
	courseDayIndexValue: string
	setCourseDayIndexValue: (value: string) => void
	courseFromPeriodValue: string | null
	setCourseFromPeriodValue: (value: string) => void
	courseToPeriodValue: string | null
	setCourseToPeriodValue: (value: string) => void
	contentClassName?: string
}

export default function EditCourseDialog({
	open,
	onOpenChange,
	onSubmit,
	tempCourse,
	courseLabelValue,
	setCourseLabelValue,
	courseRoomValue,
	setCourseRoomValue,
	courseDayIndexValue,
	setCourseDayIndexValue,
	courseFromPeriodValue,
	setCourseFromPeriodValue,
	courseToPeriodValue,
	setCourseToPeriodValue,
	contentClassName,
}: EditCourseDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={contentClassName}>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						Chỉnh sửa khóa học
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							<X />
						</Button>
					</DialogTitle>
				</DialogHeader>

				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<Textarea
						required
						value={courseLabelValue || tempCourse?.label || ""}
						onChange={(e) => setCourseLabelValue(e.target.value)}
						className="max-w-[90vw] text-[1rem]"
						placeholder="Tên của môn học"
					/>

					<Input
						required
						value={
							courseRoomValue.toUpperCase() ||
							tempCourse?.room.toUpperCase() ||
							""
						}
						onChange={(e) => setCourseRoomValue(e.target.value)}
						type="text"
						className="text-[1rem]"
						placeholder="Phòng của môn học"
					/>

					<Select
						required
						value={courseDayIndexValue || tempCourse?.day_index.toString()}
						onValueChange={setCourseDayIndexValue}
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

					<Select
						required
						value={courseFromPeriodValue || tempCourse?.from_period.toString()}
						onValueChange={setCourseFromPeriodValue}
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

					<Select
						value={courseToPeriodValue || tempCourse?.to_period.toString()}
						onValueChange={setCourseToPeriodValue}
					>
						<SelectTrigger>
							<SelectValue placeholder="Tới tiết" />
						</SelectTrigger>
						<SelectContent>
							{coursePeriods.slice(1).map((period, index) => (
								<SelectItem
									key={period.label + period.end}
									value={index.toString()}
								>
									{period.label} - {period.end}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button type="submit" className="max-w-[90vw]">
						Cập nhật môn học
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
