import type React from "react"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import type { Course } from "@/model/Course"

interface UserCoursesProps {
	userId: string
	setCourses: React.Dispatch<React.SetStateAction<Course[]>>
}

const UserCourses: React.FC<UserCoursesProps> = ({ userId, setCourses }) => {
	const supabase = createClient()
	const { toast } = useToast()

	useEffect(() => {
		if (userId) fetchUserCourses()
	}, [userId])

	const fetchUserCourses = async () => {
		const { data, error } = await supabase
			.from("course")
			.select("*")
			.eq("user_id", userId)
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

	return null
}

export default UserCourses
