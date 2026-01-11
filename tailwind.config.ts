import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom safety colors
        safety: {
          DEFAULT: "hsl(var(--safety-green))",
          light: "hsl(var(--safety-green-light))",
          dark: "hsl(var(--safety-green-dark))",
          glow: "hsl(var(--safety-green-glow))",
        },
        science: {
          DEFAULT: "hsl(var(--science-blue))",
          light: "hsl(var(--science-blue-light))",
          dark: "hsl(var(--science-blue-dark))",
        },
        ethiopian: {
          gold: "hsl(var(--ethiopian-gold))",
          "gold-light": "hsl(var(--ethiopian-gold-light))",
          red: "hsl(var(--ethiopian-red))",
          "red-light": "hsl(var(--ethiopian-red-light))",
        },
        element: {
          nonmetal: "hsl(var(--element-nonmetal))",
          "noble-gas": "hsl(var(--element-noble-gas))",
          alkali: "hsl(var(--element-alkali))",
          alkaline: "hsl(var(--element-alkaline))",
          metalloid: "hsl(var(--element-metalloid))",
          halogen: "hsl(var(--element-halogen))",
          transition: "hsl(var(--element-transition))",
          lanthanide: "hsl(var(--element-lanthanide))",
          actinide: "hsl(var(--element-actinide))",
          "post-transition": "hsl(var(--element-post-transition))",
        },
        warning: "hsl(var(--warning-orange))",
        danger: "hsl(var(--danger-red))",
        success: "hsl(var(--success-green))",
        info: "hsl(var(--info-blue))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Ethiopic', 'system-ui', 'sans-serif'],
        amharic: ['Noto Sans Ethiopic', 'Nyala', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scale-in-bounce": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "60%": { opacity: "1", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 24px hsl(var(--safety-green) / 0.3)" },
          "50%": { boxShadow: "0 0 48px hsl(var(--safety-green) / 0.6)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "blob": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "75%": { transform: "translate(30px, 10px) scale(1.05)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in-down": "fade-in-down 0.7s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "scale-in-bounce": "scale-in-bounce 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2.5s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "blob": "blob 10s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "float": "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 32px hsl(var(--safety-green) / 0.3)",
        "glow-lg": "0 0 48px hsl(var(--safety-green) / 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 20px 48px rgba(0, 0, 0, 0.12)",
        button: "0 4px 16px hsl(var(--safety-green) / 0.35)",
        "button-hover": "0 8px 24px hsl(var(--safety-green) / 0.45)",
        float: "0 16px 48px rgba(0, 0, 0, 0.15)",
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
        "gradient-ethiopian": "linear-gradient(135deg, hsl(var(--safety-green)) 0%, hsl(var(--ethiopian-gold)) 50%, hsl(var(--ethiopian-red)) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
