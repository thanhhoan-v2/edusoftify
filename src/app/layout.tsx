import { StackProvider, StackTheme } from "@stackframe/stack"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { stackServerApp } from "../stack"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

export const metadata: Metadata = {
	title: "Edusoftify",
	description: "Edusoft for laziers.",
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable}${geistMono.variable} antialiased`}
			>
				<StackProvider app={stackServerApp}>
					<StackTheme>
						{children}
						{/* <SidebarProvider> */}
						{/* 	<AppSidebar /> */}
						{/* 	<SidebarInset>{children}</SidebarInset> */}
						{/* </SidebarProvider> */}
					</StackTheme>
					<Toaster />
				</StackProvider>
			</body>
		</html>
	)
}
