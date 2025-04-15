
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Game theme colors
				game: {
					wood: 'hsl(var(--game-wood))',
					cork: 'hsl(var(--game-cork))',
					accent: 'hsl(var(--game-accent))',
					'accent-hover': 'hsl(var(--game-accent-hover))',
					red: 'hsl(var(--game-red))',
					blue: 'hsl(var(--game-blue))',
					green: 'hsl(var(--game-green))',
					yellow: 'hsl(var(--game-yellow))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-dot': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.2)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'line-draw': {
					from: {
						width: '0%',
						opacity: '0.5'
					},
					to: {
						width: '100%',
						opacity: '1'
					}
				},
				'box-complete': {
					from: {
						transform: 'scale(0.5)',
						opacity: '0'
					},
					to: {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
				'line-draw': 'line-draw 0.3s ease-out forwards',
				'box-complete': 'box-complete 0.4s ease-out forwards'
			},
			backgroundImage: {
				'wood-pattern': "url('/assets/wooden-background.jpg')",
				'cork-board': "url('/lovable-uploads/2f7ed8b7-1f37-47a6-a840-1d1280abdb33.png')",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
