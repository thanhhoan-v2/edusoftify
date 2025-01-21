export type Course = {
	id: string;
	user_id: string;
	label: string;
	room: string;
	code?: string;
	from_period: number;
	to_period: number;
	is_lab: boolean;
	note: string;
	day_index: number;
};
