import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar"
import {
	COURSES_PAGE,
	HOME_PAGE,
	SEARCH_PAGE,
	SETTINGS_PAGE,
} from "@/lib/routes"
import { Edit, Home, Search, Settings } from "lucide-react"
import Link from "next/link"

const items = [
	{
		title: "Home",
		url: HOME_PAGE,
		icon: Home,
	},
	{
		title: "Your courses",
		url: COURSES_PAGE,
		icon: Edit,
	},
	{
		title: "Search",
		url: SEARCH_PAGE,
		icon: Search,
	},
	{
		title: "Settings",
		url: SETTINGS_PAGE,
		icon: Settings,
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<h1 className="font-bold text-2xl">Edusoftify</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
