import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { coursePeriods } from "@/lib/course_periods"
import { cn } from "@/lib/utils"
import type { Course } from "@/model/Course"
import { MapPin, Timer, TimerOff } from "lucide-react"
import Balancer from "react-wrap-balancer"

export default function CourseItem({
	label,
	room,
	from_period,
	to_period,
	note,
}: Course) {
	const getRoomPlace = (room: string) => {
		const roomValue = room.toUpperCase()
		switch (true) {
			case roomValue.slice(0, 2) === "LA":
				return "IU - Lớp Thực hành"
			case roomValue.startsWith("L"):
				return "Hội trường Trần Chí Đáo"
			case roomValue.startsWith("C"):
				return "Viện Môi Trường"
			default:
				return "IU - Lớp Lý thuyết"
		}
	}

	const getRoomClassName = (room: string) => {
		const roomValue = room.toUpperCase()
		switch (true) {
			case roomValue.slice(0, 2) === "LA":
				return "decoration-green-400"
			case roomValue.startsWith("C"):
				return "decoration-yellow-400"
			default:
				return "decoration-cyan-400"
		}
	}

	return (
		<>
			<Card
				key={label}
				className="h-fit w-full border-2 border-black bg-base-100 p-3 shadow-xl"
			>
				<CardHeader>
					{/* Label */}
					<CardTitle className="font-bold text-xl">
						<Balancer>{label}</Balancer>
					</CardTitle>
					<CardDescription>
						<div className="flex w-full flex-col justify-start gap-4">
							<div
								className={cn(
									"font-semibold underline decoration-wavy",
									getRoomClassName(room),
								)}
							>
								Học tại {getRoomPlace(room)}
							</div>
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent className="w-full">
					{/* Room */}
					<div className="flex items-center gap-2">
						<MapPin />
						<p>{room.toUpperCase()}</p>
					</div>
					{/* From period */}
					<div className="flex items-center gap-2">
						<Timer />
						<Badge className="text-nowrap border-black font-bold">
							{coursePeriods[from_period].label}
						</Badge>
						<div>{coursePeriods[from_period].start}</div>
					</div>

					{/* To period */}
					<div className="flex items-center gap-2">
						<TimerOff />
						<Badge className="text-nowrap border-black font-bold">
							{coursePeriods[to_period].label}
						</Badge>
						<div>{coursePeriods[to_period].end}</div>
					</div>
				</CardContent>
			</Card>
		</>
	)
}
