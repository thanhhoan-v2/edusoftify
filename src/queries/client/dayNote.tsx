import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export async function updateDayNote(dayNote: string, noteId: string) {
	return await supabase
		.from("day_notes")
		.update({ value: dayNote })
		.eq("id", noteId)
		.select()
}

export async function createDayNote(dayNote: string, date: Date) {
	return await supabase
		.from("day_notes")
		.insert([{ value: dayNote, onDate: date }])
		.select()
}
