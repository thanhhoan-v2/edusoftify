"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import UserCourses from "@/components/user-courses"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@stackframe/stack"
import { User, UserPlus, UserX } from "lucide-react"
import { useEffect, useState } from "react"

interface SerializedUser {
	id: string
	userName: string
	avatarUrl?: string | null
}

export default function UserProfile({
	initialUser,
}: { initialUser: SerializedUser }) {
	const [isFriend, setIsFriend] = useState<boolean>(false)

	const [bioFormOpen, setBioFormOpen] = useState(false)
	const [bioValue, setBioValue] = useState<string>("")

	const [noFriends, setNoFriends] = useState<number>(0)

	const user = useUser()
	const supabase = createClient()

	const senderId = user?.id
	const receiverId = initialUser.id

	useEffect(() => {
		checkExistingFriend()
		checkExistingBio()
		fetchFriends()
	}, [])

	const fetchFriends = async () => {
		const { data: friends, error } = await supabase
			.from("friends")
			.select("*")
			.or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)

		if (friends && friends.length > 0) {
			setNoFriends(friends.length)
		}
	}

	const checkExistingFriend = async () => {
		const { data: existingFriend } = await supabase
			.from("friends")
			.select("*")
			.eq("sender_id", senderId)
			.eq("receiver_id", receiverId)

		if (existingFriend && existingFriend.length > 0) setIsFriend(true)
	}

	const checkExistingBio = async () => {
		const { data: existingBio } = await supabase
			.from("users")
			.select("bio")
			.eq("id", initialUser.id)

		if (existingBio) {
			setBioValue(existingBio[0].bio)
		}
	}

	const handleAddOrDeleteFriend = async () => {
		if (!isFriend) {
			await supabase.from("friends").insert([
				{
					sender_id: senderId,
					receiver_id: receiverId,
				},
			])
			setIsFriend(true)
		} else {
			await supabase
				.from("friends")
				.delete()
				.eq("sender_id", senderId)
				.eq("receiver_id", receiverId)
			setIsFriend(false)
		}
	}

	const handleBioFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await supabase
			.from("users")
			.update({ bio: bioValue })
			.eq("id", initialUser.id)
	}

	return (
		<>
			<div className="flex h-full w-full flex-col p-4">
				<div className="mt-[20px] flex items-center justify-between gap-5 px-4">
					<div className="flex flex-col gap-4">
						<h1 className="font-bold text-3xl">
							{initialUser ? initialUser.userName : "Unknown User"}
						</h1>

						{initialUser.id === user?.id && (
							<blockquote className="mt-1 border-l-2 pl-3 italic">
								<p className="whitespace-pre-wrap break-words">{bioValue}</p>
							</blockquote>
						)}
					</div>

					<div className="flex items-center gap-4">
						<Avatar className="h-24 w-24">
							<AvatarImage src={initialUser?.avatarUrl ?? ""} />
							<AvatarFallback>{initialUser.userName[0]}</AvatarFallback>
						</Avatar>
					</div>
				</div>

				<div className="mt-[30px] ml-[20px] flex w-max items-center gap-2 hover:cursor-pointer hover:underline hover:decoration-wavy">
					<User size={19} />
					<p>
						{noFriends} friend{noFriends === 1 ? "" : "s"}
					</p>
				</div>

				<div className="mt-[30px]">
					{user?.id !== initialUser?.id ? (
						<Button
							variant={isFriend ? "destructive" : "outline"}
							className="w-full"
							onClick={handleAddOrDeleteFriend}
						>
							{isFriend ? (
								<>
									<UserX /> Đéo chơi nữa
								</>
							) : (
								<>
									<UserPlus /> Kết bạn
								</>
							)}
						</Button>
					) : (
						<Button className="w-full" onClick={() => setBioFormOpen(true)}>
							Edit bio
						</Button>
					)}
				</div>

				<UserCourses queryUserId={initialUser.id} />
			</div>

			<Drawer open={bioFormOpen} onOpenChange={setBioFormOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Bio</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter>
						<form onSubmit={handleBioFormSubmit} className="w-full">
							<textarea
								className="textarea textarea-ghost mt-[10px] h-[60vh] w-full border-2 border-black"
								value={bioValue}
								onChange={(e) => setBioValue(e.target.value)}
							/>
							<div className="mt-1 flex h-[50px] justify-around gap-4">
								<DrawerClose className="mt-4 flex w-screen justify-between">
									{/* <Button variant="outline" onClick={handleDeleteDayNote}> */}
									{/* 	Delete */}
									{/* </Button> */}
									<Button type="submit">Save</Button>
								</DrawerClose>
							</div>
						</form>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	)
}
