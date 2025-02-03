"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getUserById } from "@/queries/server/getUserById"
import { AnimatePresence, motion } from "framer-motion"
import { MoreHorizontalIcon } from "lucide-react"
import { useEffect } from "react"

const listVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

export type CommonLearner = {
	userId: string
	userName: string
	userAvatarUrl: string
}

const UserList = ({ commonLearners }: { commonLearners: CommonLearner[] }) => {
	return (
		<AnimatePresence>
			<motion.div
				className="space-y-4"
				initial="hidden"
				animate="visible"
				exit="hidden"
				variants={listVariants}
			>
				{commonLearners.map(({ userName, userAvatarUrl }) => (
					<motion.div
						key={userName}
						className="flex items-center justify-between gap-2"
						variants={itemVariants}
						transition={{ type: "tween" }}
					>
						<div className="flex items-center gap-4">
							<Avatar className="h-14 w-14">
								<AvatarImage src={userAvatarUrl} />
								<AvatarFallback>hi</AvatarFallback>
							</Avatar>
							<div>
								<span className="block font-semibold text-sm leading-none">
									{userName}
								</span>
								<span className="text-xs leading-none">@{userName}</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button size="icon" variant="outline">
								<MoreHorizontalIcon className="h-5 w-5" />
							</Button>
						</div>
					</motion.div>
				))}
			</motion.div>
		</AnimatePresence>
	)
}

export default function CommonLearnersList({ userIds }: { userIds: string[] }) {
	const commonLearners: CommonLearner[] = []

	useEffect(() => {
		fetchUsersById(userIds)
	})

	const fetchUsersById = async (userIds: string[]) => {
		for (let i = 0; i < userIds.length; i++) {
			const userId = userIds[i]
			const user = await getUserById(userId)
			if (user) {
				commonLearners.push({
					userId: user?.id,
					userName: user?.userName,
					userAvatarUrl: user?.userAvatarUrl,
				})
			}
		}
	}

	return (
		<div className="w-full">
			<UserList commonLearners={commonLearners} />
		</div>
	)
}
