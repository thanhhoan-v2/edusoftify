export type Course = {
	label: string;
	room: string;
	from: string;
	to: string;
	isLab: boolean;
	timeNotation: "AM" | "PM";
};

export const MobileApplication: Course = {
	label: "Mobile Application",
	room: "A1.204",
	from: "13:15",
	to: "16:40",
	isLab: false,
	timeNotation: "PM",
};

export const MobileApplicationLab: Course = {
	label: "Mobile Application Lab",
	room: "LA1.604",
	from: "13:15",
	to: "17:30",
	isLab: true,
	timeNotation: "PM",
};

export const SecurityManagement: Course = {
	label: "Security Management In Practice",
	room: "A2.311",
	from: "8:00",
	to: "11:30",
	isLab: false,
	timeNotation: "AM",
};

export const SecurityManagementLab: Course = {
	label: "Security Management In Practice Lab",
	room: "LA1.604",
	from: "8:00",
	to: "12:15",
	isLab: true,
	timeNotation: "AM",
};

export const ITProject: Course = {
	label: "Information Technology Project",
	room: "A2.312",
	from: "13:15",
	to: "16:40",
	isLab: false,
	timeNotation: "PM",
};

export const WebDev: Course = {
	label: "Advanced Topics in Web Development",
	room: "A2.312",
	from: "13:15",
	to: "16:40",
	isLab: false,
	timeNotation: "PM",
};

export const WebDevLab: Course = {
	label: "Advanced Topics in Web Development Lab",
	room: "LA1.604",
	from: "8:00",
	to: "12:15",
	isLab: true,
	timeNotation: "AM",
};
