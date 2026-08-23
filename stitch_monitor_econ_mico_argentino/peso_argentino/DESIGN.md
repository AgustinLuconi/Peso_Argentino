---
name: Peso Argentino
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#434750'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#375f99'
  primary: '#00234a'
  on-primary: '#ffffff'
  primary-container: '#003870'
  on-primary-container: '#7da3e2'
  inverse-primary: '#a8c8ff'
  secondary: '#236391'
  on-secondary: '#ffffff'
  secondary-container: '#91c9fe'
  on-secondary-container: '#0b5583'
  tertiary: '#302000'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c3400'
  on-tertiary-container: '#d2970a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1a477f'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#96ccff'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004a75'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#fbbc38'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-stakes financial and political landscape. It balances institutional authority with modern digital efficiency. The personality is **authoritative, analytical, and patriotic**, without being populist. 

The design style is **Corporate / Modern** with a focus on high information density. It utilizes a structured grid, purposeful whitespace, and a restrained use of color to ensure that critical financial data and political commentary remain the primary focus. The visual language avoids decorative flourishes, opting instead for precision, clarity, and a sense of permanence.

## Colors
The palette is rooted in the Argentine national colors but elevated for a professional context. 
- **Primary (Deep Navy):** Used for headers, primary actions, and branding to establish trust and stability.
- **Secondary (Sky Blue):** Used for highlights, active states, and links, providing a modern, energetic contrast to the navy.
- **Tertiary (Sun Gold):** Reserved for critical alerts or specific economic indicators (e.g., gold prices, breaking news tags).
- **Surface & Neutrals:** A range of cool grays (#F9FAFB to #111827) facilitates content hierarchy and separates data modules.
- **Status Colors:** Standardized Red (#DC2626) for market drops and Green (#16A34A) for market gains.

## Typography
This design system employs a dual-typeface strategy to distinguish between narrative content and technical data.
- **Headlines:** Use **Source Serif 4**. Its sturdy, academic construction provides the "institutional" feel necessary for political journalism.
- **Body & UI:** Use **Inter**. This font is selected for its exceptional legibility at small sizes and high x-height, which is essential for reading long-form news on digital screens.
- **Financial Data:** Use **JetBrains Mono** for numerical values in tables and tickers. The monospaced nature ensures that columns of currency and percentages align perfectly for quick scanning.

## Layout & Spacing
The layout follows a **12-column fixed grid** on desktop (max-width: 1280px) and a **4-column fluid grid** on mobile. 

A strict 4px baseline grid ensures vertical rhythm. Spacing is intentionally generous between articles to prevent cognitive overload, but compact within data-heavy cards to allow for maximum information density. 
- **Desktop Sidebar:** A fixed 280px left-hand navigation is preferred for platform-style news tools.
- **Desktop Content:** Main feed occupies 8 columns, with a 4-column "Market Pulse" sidebar on the right.
- **Margins:** 24px on mobile, 40px+ on desktop to provide a "premium" breathing room.

## Elevation & Depth
Elevation in this design system is used to signify "interactivity" versus "information."
- **Level 0 (Background):** Flat, light gray surfaces (#F3F4F6) for the main application background.
- **Level 1 (Cards):** White surfaces with a **low-contrast outline** (1px solid #E5E7EB). No shadows are used for standard news cards to maintain a clean, journalistic look.
- **Level 2 (Interactive/Floating):** Subtle, diffused ambient shadows (0 4px 12px rgba(0, 56, 112, 0.08)) are applied only to modals, dropdowns, and active financial charts to pull them forward in the hierarchy.
- **Tonal Layers:** Data headers use a slight darkening of the surface (#F9FAFB) to differentiate titles from content.

## Shapes
The shape language is **Soft**. A 4px (0.25rem) corner radius is applied to buttons, input fields, and cards. This slight rounding takes the "edge" off the institutional feel without becoming too casual or consumer-oriented. 
- **Tags/Chips:** Use a slightly higher radius (8px) to distinguish them as clickable, metadata elements.
- **Charts:** Line graphs should use sharp or very slightly smoothed points; avoid heavy curves to maintain the integrity of financial data visualization.

## Components
- **Financial Data Cards:** Must feature a "Trend Indicator" (Sparkline) and a clear delta value (+/- %). Use JetBrains Mono for the price and Inter for the asset name.
- **News Grids:** Headlines should be prominent. Images should have a consistent 16:9 aspect ratio with a subtle 1px inner border.
- **Buttons:** Primary buttons use the Deep Navy background with white text. Secondary buttons use a Sky Blue ghost style (outline).
- **Navigation:** A persistent top bar or left sidebar with "Market Status" (Open/Closed) and a search bar for tickers or political figures.
- **Charts:** Minimalist styling. No background grid lines unless necessary for value mapping. Use Sky Blue for the primary data series and Deep Navy for the benchmark/average.
- **Input Fields:** Institutional styling with 1px gray borders that turn Sky Blue on focus. Labels should always be visible (never floating).