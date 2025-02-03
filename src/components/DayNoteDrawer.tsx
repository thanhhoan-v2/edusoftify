import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import { Loader2 } from "lucide-react"
import type React from "react"

interface DayNoteDrawerProps {
	noteDrawerOpen: boolean
	setNoteDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
	dayNote: string
	setDayNote: React.Dispatch<React.SetStateAction<string>>
	isSavingNote: boolean
	handleDayNoteSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	handleDeleteDayNote: () => void
	dayOfTheWeek: string
	dateAndMonth: string
}

const DayNoteDrawer: React.FC<DayNoteDrawerProps> = ({
	noteDrawerOpen,
	setNoteDrawerOpen,
	dayNote,
	setDayNote,
	isSavingNote,
	handleDayNoteSubmit,
	handleDeleteDayNote,
	dayOfTheWeek,
	dateAndMonth,
}) => {
	return (
		<Drawer open={noteDrawerOpen} onOpenChange={setNoteDrawerOpen}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Ghi chú</DrawerTitle>
					<DrawerDescription>
						{dayOfTheWeek} - {dateAndMonth}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<form onSubmit={handleDayNoteSubmit} className="w-full">
						<textarea
							className="textarea textarea-ghost mt-[10px] h-[60vh] w-full"
							value={dayNote}
							onChange={(e) => setDayNote(e.target.value)}
							placeholder={`Notes on ${dayOfTheWeek} ${dateAndMonth}`}
						/>
						<div className="mt-1 flex h-[50px] justify-around gap-4">
							{dayNote.length > 0 && (
								<DrawerClose className="mt-4 flex w-screen justify-between">
									<Button variant="outline" onClick={handleDeleteDayNote}>
										Delete
									</Button>
									{isSavingNote ? (
										<Button className="btn btn-secondary" disabled>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving
										</Button>
									) : (
										<Button type="submit">Save</Button>
									)}
								</DrawerClose>
							)}
						</div>
					</form>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default DayNoteDrawer
