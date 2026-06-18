import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/** Compose an HSL token so Tailwind can apply alpha: `bg-surface-raised/60`. */
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "32px", "2xl": "48px" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["SF Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        /* ---- Semantic surfaces ---- */
        surface: {
          sunken: token("surface-sunken"),
          base: token("surface-base"),
          raised: token("surface-raised"),
          overlay: token("surface-overlay"),
          glass: token("surface-glass"),
        },
        /* ---- Semantic text ---- */
        text: {
          primary: token("text-primary"),
          secondary: token("text-secondary"),
          tertiary: token("text-tertiary"),
          inverse: token("text-inverse"),
        },
        /* ---- Borders ---- */
        hairline: token("border-subtle"),
        line: { DEFAULT: token("border-default"), strong: token("border-strong") },
        /* ---- Interactive ---- */
        interactive: {
          DEFAULT: token("interactive-default"),
          hover: token("interactive-hover"),
          pressed: token("interactive-pressed"),
          foreground: token("interactive-foreground"),
          subtle: token("interactive-subtle"),
        },
        /* ---- Feedback ---- */
        feedback: {
          success: token("feedback-success"),
          "success-foreground": token("feedback-success-foreground"),
          warning: token("feedback-warning"),
          "warning-foreground": token("feedback-warning-foreground"),
          error: token("feedback-error"),
          "error-foreground": token("feedback-error-foreground"),
          info: token("feedback-info"),
          "info-foreground": token("feedback-info-foreground"),
        },

        /* ---- Brand primitives (for charts / accents only) ---- */
        brand: {
          100: token("brand-100"), 200: token("brand-200"), 300: token("brand-300"),
          400: token("brand-400"), 500: token("brand-500"), 600: token("brand-600"),
          700: token("brand-700"), 800: token("brand-800"), 900: token("brand-900"),
        },

        /* ---- Legacy shadcn aliases (remapped onto semantic tokens) ---- */
        border: token("border-default"),
        input: token("border-default"),
        ring: token("interactive-default"),
        background: token("surface-base"),
        foreground: token("text-primary"),
        primary: { DEFAULT: token("interactive-default"), foreground: token("interactive-foreground") },
        secondary: { DEFAULT: token("surface-raised"), foreground: token("text-primary") },
        destructive: { DEFAULT: token("feedback-error"), foreground: token("feedback-error-foreground") },
        success: { DEFAULT: token("feedback-success"), foreground: token("feedback-success-foreground") },
        warning: { DEFAULT: token("feedback-warning"), foreground: token("feedback-warning-foreground") },
        muted: { DEFAULT: token("surface-overlay"), foreground: token("text-secondary") },
        accent: { DEFAULT: token("surface-overlay"), foreground: token("text-primary") },
        popover: { DEFAULT: token("surface-overlay"), foreground: token("text-primary") },
        card: { DEFAULT: token("surface-raised"), foreground: token("text-primary") },
        profit: token("profit"),
        loss: token("loss"),
        neutral: token("neutral"),
      },

      /* ---- Type scale: fluid (clamp) so large figures/headings never
         overflow on mobile yet keep their desktop presence. ---- */
      fontSize: {
        display: ["clamp(2rem, 7vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.022em", fontWeight: "700" }],
        h1: ["clamp(1.5rem, 4.5vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["clamp(1.25rem, 3.5vw, 1.5rem)", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        h3: ["clamp(1.125rem, 2.5vw, 1.25rem)", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" }],
      },

      /* ---- 8pt spacing grid (4pt micro permitted for component density) ---- */
      spacing: {
        "0.5": "2px",
        "1": "4px",   // micro
        "2": "8px",
        "3": "12px",  // micro/internal
        "4": "16px",
        "5": "20px",  // micro/internal
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },

      boxShadow: {
        "elevation-1": "var(--shadow-1)",
        "elevation-2": "var(--shadow-2)",
        "elevation-3": "var(--shadow-3)",
        "elevation-4": "var(--shadow-4)",
        focus: "var(--shadow-focus)",
        glow: "var(--shadow-glow)",
        /* legacy aliases */
        sm: "var(--shadow-1)",
        md: "var(--shadow-2)",
        lg: "var(--shadow-3)",
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-surface": "var(--gradient-surface)",
        "gradient-page": "var(--gradient-page)",
        /* legacy aliases (remapped onto semantic surfaces) */
        "gradient-dark": "var(--gradient-dark)",
        "gradient-card": "var(--gradient-card)",
      },

      backdropBlur: { glass: "20px", "glass-strong": "28px" },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate: "cubic-bezier(0, 0, 0.2, 1)",
        accelerate: "cubic-bezier(0.4, 0, 1, 1)",
      },
      transitionDuration: {
        micro: "120ms",
        interaction: "200ms",
        layout: "280ms",
        page: "440ms",
      },

      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "overlay-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "content-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        "menu-in": { from: { opacity: "0", transform: "scaleY(0.95)" }, to: { opacity: "1", transform: "scaleY(1)" } },
        "toast-in": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s var(--ease-decelerate)",
        "accordion-up": "accordion-up 0.2s var(--ease-accelerate)",
        "overlay-in": "overlay-in 0.2s var(--ease-decelerate)",
        "content-in": "content-in 0.25s var(--ease-decelerate)",
        "menu-in": "menu-in 0.15s var(--ease-decelerate)",
        "toast-in": "toast-in 0.3s var(--ease-decelerate)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
