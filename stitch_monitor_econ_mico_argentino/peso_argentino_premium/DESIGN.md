---
name: Peso Argentino Premium
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#43474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#000d21'
  on-primary: '#ffffff'
  primary-container: '#002347'
  on-primary-container: '#718bb5'
  inverse-primary: '#adc8f5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#0a0d10'
  on-tertiary: '#ffffff'
  tertiary-container: '#202326'
  on-tertiary-container: '#878a8e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2c486d'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e0e2e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1f'
  on-tertiary-fixed-variant: '#44474a'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  bullish-green: '#115E59'
  bearish-red: '#991B1B'
  champagne-light: '#F1E9DB'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Source Serif 4
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The design system establishes an **imposing, institutional, and premium** presence, shifting the brand from a standard digital interface to a high-status "object of value." It targets a sophisticated audience of investors, policy-makers, and financial analysts who require **authoritative intelligence** and **financial precision**.

The visual direction is a fusion of **Modern Minimalism** and **Editorial Prestige**. It draws inspiration from the heritage of global financial broadsheets (FT, WSJ) while maintaining the functional clarity of an official central bank portal. The aesthetic is defined by its restraint: heavy whitespace, a disciplined palette, and high-contrast typography that commands respect and ensures the UI feels permanent and trustworthy.

## Colors

The palette is anchored by **Deep Navy (#002347)**, representing institutional stability and "The State." This is contrasted by **Gold/Champagne (#C5A059)**, which is used sparingly for accents, high-level indicators, and premium call-to-actions to evoke wealth and exclusivity.

- **Primary:** Deep Navy. Used for core structural elements, navigation, and primary branding.
- **Secondary:** Gold/Champagne. Reserved for highlights, success metrics, and "premium" tier features.
- **Surface Strategy:** The system utilizes a very light neutral gray (#F8F9FA) for backgrounds to ensure the deep navy and gold elements pop without the harshness of pure white.
- **Semantic Indicators:** Market data uses desaturated, sophisticated tones of green and red to maintain the professional, non-alarmist tone.

## Typography

This system utilizes an aggressive typographic scale to establish hierarchy and authority.

- **Headlines:** **Source Serif 4** is the primary voice. It is scaled up significantly for a broadsheet feel. Heavy weights and tight letter-spacing are used for large displays to create an "imposing" effect.
- **Labels & UI:** **Hanken Grotesk** replaces standard sans-serifs. It is tracked out (0.1em) and often set in uppercase for "label-caps" to create a modern, institutional look similar to technical architectural drawings or official documents.
- **Numerical Data:** **JetBrains Mono** remains for tabular data and tickers to ensure mathematical alignment and precision.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** model (1440px) that prioritizes wide margins to convey "premium space." 

A 12-column system is used with generous 32px gutters, allowing for complex data sets to breathe. On mobile, the system collapses to a 4-column grid with reduced margins, but maintains the 8px baseline rhythm. 

- **Density:** Information density is high within components, but the space between major sections is expansive.
- **Asymmetry:** To mirror high-end editorial layouts, the use of asymmetrical column spans (e.g., a 3-column sidebar vs. a 9-column main feed) is encouraged for long-form analysis.

## Elevation & Depth

To make UI elements feel like "objects of value," this design system moves away from flat design towards **Tactile Professionalism**. 

1.  **Object Value:** Cards and containers use a very soft, multi-layered shadow (0 4px 20px rgba(0, 35, 71, 0.05)) combined with a 1px inner border in a lighter tint of the background or a subtle Champagne line.
2.  **Tonal Tiers:** Content is organized on "Tiers." The background is the lowest level. Primary content sits on white cards. Secondary information is placed on cards with a Deep Navy or light Champagne wash.
3.  **Active Depth:** Elements like buttons or selected cards may use a slight inner shadow (inset) to simulate a physical press or a "stamped" institutional seal.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a precise, engineered feel. 

- **Strict Corners:** Avoid pill shapes or large radii. The 4px corner is the standard for cards and inputs to maintain a sense of structural integrity.
- **Refinement:** For ultra-premium elements, such as a specialized "Investment Report" card, a 0px (Sharp) corner may be used for a more classical, brutalist financial aesthetic.
- **Dividers:** Use thin, 1px lines in Deep Navy (at 10% opacity) or Champagne to separate technical data without adding visual bulk.

## Components

- **Institutional Buttons:** Primary buttons are Deep Navy with white text. They use "Label-Caps" typography. "Premium" actions use a Gold border with a transparent background.
- **Premium Cards:** Must feature a 1px "Stroke of Value" (Champagne #C5A059) on the top edge or as a subtle inner border to elevate the component above standard content.
- **Data Tickers:** Horizontal scrolling bars at the top or bottom of the screen. Use a Deep Navy background with Gold text for high-importance indices (e.g., ARS/USD).
- **Inputs:** Use a "minimalist desk" style: only a bottom border (2px Deep Navy) when inactive, moving to a full 1px Champagne border on focus. Labels are always "Label-Caps" and positioned above the field.
- **Analytical Charts:** Use the Deep Navy for the primary line and a Gold fill area (10% opacity) beneath it. Grid lines should be very faint, appearing only on hover.