import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { coursePeriods } from "@/lib/course_periods";
import type { Course } from "@/model/Course";
import { Clock2, MapPin } from "lucide-react";

export default function CourseItem({
	label,
	room,
	from_period,
	to_period,
	is_lab,
	note,
}: Course) {
	return (
		<>
			<div
				key={label}
				className={
					"card bg-base-100 w-full border-2 border-black shadow-xl h-fit"
				}
			>
				<div className="card-body w-full">
					{/* Label */}
					<h2 className="card-title font-bold text-xl">{label}</h2>
					<div className="w-full justify-start flex gap-4">
						{/* Room */}
						<div className="flex gap-2 items-center">
							<MapPin />
							<p>{room.toUpperCase()}</p>
						</div>
						{/* Is lab? */}
						{is_lab && (
							<div className="badge badge-outline badge-primary">LAB</div>
						)}
					</div>
					{/* From - to periods */}
					<div className="flex gap-2">
						<Clock2 />
						<div className="flex gap-2 items-start">
							{/* From period */}
							<div>
								<div className="flex items-center gap-2">
									<p className="badge text-nowrap">
										{coursePeriods[from_period].label}
									</p>
									<p>{coursePeriods[from_period].start}</p>
								</div>
							</div>
							<div>
								<p>-</p>
							</div>
							{/* To period */}
							<div>
								<div className="flex items-center gap-2">
									<p className="badge text-nowrap">
										{coursePeriods[to_period].label}
									</p>
									<p>{coursePeriods[to_period].end}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
