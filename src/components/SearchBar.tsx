"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getUserById } from "@/queries/server/getUserById"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@stackframe/stack"
import { Loader2, X } from "lucide-react"
import Link from "next/link"
import React from "react"

interface SearchBarProps {
	className?: string
	placeholder?: string
}

type User = {
	id: string
	userName: string
	avatarUrl: string
}

export default function SearchBar({
	placeholder = "Type here to search",
}: SearchBarProps) {
	const [searchValue, setSearchValue] = React.useState("")
	const [isSearching, setIsSearching] = React.useState(false)
	const [searchResults, setSearchResults] = React.useState<User[]>([])

	const user = useUser()
	const supabase = createClient()

	const handleSearch = async () => {
		const searchPattern = `%${searchValue}%`
		if (searchValue.length > 0) {
			setIsSearching(true)
			try {
				const { data: results } = await supabase
					.from("users")
					.select("*")
					.ilike("user_name", searchPattern)
				console.log("[SearchBar] Search results:", results)

				if (results) {
					for (let i = 0; i < results.length; i++) {
						const result = results[i]
						const user = await getUserById(result.id)
						if (user) {
							setSearchResults((prev) => {
								const existingIds = new Set(prev.map((u) => u.id))
								return existingIds.has(user.id) ? prev : [...prev, user]
							})
						}
					}
				}
			} catch (error) {
				console.error("[SearchBar] Error searching:", error)
				setSearchResults([])
			} finally {
				setIsSearching(false)
			}
		} else {
			setSearchResults([])
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch()
		}
	}

	React.useEffect(() => {
		const timeoutId = setTimeout(handleSearch, 300)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [searchValue])

	return (
		<div className="w-full p-4">
			<div className="relative">
				<div className="relative">
					{/* <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" /> */}
					<Input
						placeholder={placeholder}
						value={searchValue}
						onChange={(e) => {
							console.log("[SearchBar] Input changed:", e.target.value)
							setSearchValue(e.target.value)
						}}
						onKeyUp={handleKeyPress}
						className="pl-2"
					/>
					{searchValue.length > 0 && (
						<X
							className="absolute top-2.5 right-2 h-4 w-4 cursor-pointer text-muted-foreground"
							onClick={() => setSearchValue("")}
						/>
					)}
				</div>
			</div>

			<div className="my-4 flex flex-col gap-2">
				{isSearching ? (
					<div className="flex justify-center p-4">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : (
					searchResults.length > 0 &&
					searchResults.map((searchResult) => (
						<Link href={`/${searchResult?.id}`} key={searchResult.id}>
							<div className="flex items-center justify-between rounded-lg bg-gray-200 p-4">
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage src={searchResult.avatarUrl ?? ""} />
										<AvatarFallback>{searchResult.userName[0]}</AvatarFallback>
									</Avatar>
									<span>{searchResult?.userName}</span>
								</div>

								{/* <Button variant="ghost"> */}
								{/* 	<UserPlus /> */}
								{/* </Button> */}
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	)
}
