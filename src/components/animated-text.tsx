"use client"

import { motion } from "framer-motion"
interface HandWrittenTitleProps {
	title?: string
	subtitle?: string
}

export const AnimatedText = ({
	title = "Hand Written",
	subtitle = "Optional subtitle",
}: HandWrittenTitleProps) => {
	const draw = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: {
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
				opacity: { duration: 0.5 },
			},
		},
	}

	return (
		<div className="relative mx-auto w-[70vw] max-w-4xl py-24">
			<div className="absolute inset-0">
				<motion.svg
					width="300%"
					height="300%"
					viewBox="0 0 1200 600"
					initial="hidden"
					animate="visible"
					className="h-full w-full"
				>
					<motion.path
						d="M 950 90 
                           C 1250 300, 1050 480, 600 520
                           C 250 520, 150 480, 150 300
                           C 150 120, 350 80, 600 80
                           C 850 80, 950 180, 950 180"
						fill="none"
						strokeWidth="12"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						variants={draw}
						className="text-black opacity-90 dark:text-white"
					/>
				</motion.svg>
			</div>
			<div className="relative z-10 flex flex-col items-center justify-center text-center">
				<motion.h2
					className="mb-1 flex items-center gap-2 font-black text-2xl text-black tracking-tighter md:text-6xl dark:text-white"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
				>
					{title}
				</motion.h2>
				{subtitle && (
					<motion.p
						className="text-black/80 text-xl dark:text-white/80"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.8 }}
					>
						{subtitle}
					</motion.p>
				)}
			</div>
		</div>
	)
}
