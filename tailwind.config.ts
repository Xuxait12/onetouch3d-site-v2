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
				blue: {
					soft: 'hsl(var(--blue-soft))',
					light: 'hsl(var(--blue-light))'
				}
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'Arial', 'sans-serif']
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'elegant': 'var(--shadow-elegant)'
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-cta': 'var(--gradient-cta)'
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
				aurora: {
					from: {
						backgroundPosition: "50% 50%, 50% 50%",
					},
					to: {
						backgroundPosition: "350% 50%, 350% 50%",
					},
				},
				infiniteScroll: {
					'0%': {
						transform: 'translateX(0)',
					},
					'100%': {
						transform: 'translateX(-50%)',
					},
				},
				gradientShift: {
					'0%': { 
						backgroundPosition: '0% 50%' 
					},
					'50%': { 
						backgroundPosition: '100% 50%' 
					},
					'100%': { 
						backgroundPosition: '0% 50%' 
					}
				},
				'fade-in-down': {
					from: {
						opacity: '0',
						transform: 'translateY(-30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-left': {
					from: {
						opacity: '0',
						transform: 'translateX(-50px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(50px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'fade-in-right': {
					from: {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'fade-in-left': {
					from: {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'fade-in-up': {
					from: {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'zoom-in': {
					from: {
						opacity: '0',
						transform: 'scale(0.8)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'rotate-in-up-left': {
					from: {
						opacity: '0',
						transform: 'rotate(-45deg) translateY(30px) translateX(-30px) scale(0.8)'
					},
					to: {
						opacity: '1',
						transform: 'rotate(0deg) translateY(0) translateX(0) scale(1)'
					}
				},
				'zoom-in-up': {
					from: {
						opacity: '0',
						transform: 'scale(0.8) translateY(30px)'
					},
					to: {
						opacity: '1',
						transform: 'scale(1) translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				aurora: "aurora 60s linear infinite",
				'infinite-scroll': 'infiniteScroll 30s linear infinite',
				'gradient-shift': 'gradientShift 8s ease-in-out infinite',
				'fade-in-down': 'fade-in-down 1s ease-out',
				'slide-in-left': 'slide-in-left 0.8s ease-out',
				'slide-in-right': 'slide-in-right 0.8s ease-out',
				'fade-in-right': 'fade-in-right 0.9s ease-out',
				'fade-in-left': 'fade-in-left 0.9s ease-out',
				'fade-in-up': 'fade-in-up 1s ease-out',
				'zoom-in': 'zoom-in 1.1s ease-out',
				'rotate-in-up-left': 'rotate-in-up-left 1.2s ease-out',
				'zoom-in-up': 'zoom-in-up 1s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config;

const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
}
