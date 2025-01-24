import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
	message: string
	avatarUrl: string | null
	children?: React.ReactNode
}

export function ChatBubble({ message, avatarUrl, children }: ChatBubbleProps) {
	return (
		<div className="mb-4 flex items-center">
			<Avatar className="h-8 w-8">
				<AvatarImage src={avatarUrl ?? ""} alt="User avatar" />
				<AvatarFallback>you</AvatarFallback>
			</Avatar>
			<div
				className={cn(
					"mx-2 flex max-w-[80%] flex-col rounded-2xl p-3 sm:max-w-[70%] md:max-w-[60%]",
					"bg-gray-200 text-gray-800",
				)}
			>
				<div
					className="-left-3 absolute h-0 w-0 border-8 border-gray-200 border-t-transparent border-l-transparent"
					style={{ bottom: "12px" }}
				/>
				<p className="break-words text-sm sm:text-base">
					{message.length > 0
						? message
						: "Học hành như cá kho tiêu, kho nhiều thì mặn học nhiều thì ngu."}
				</p>
				{children}
			</div>
		</div>
	)
}
