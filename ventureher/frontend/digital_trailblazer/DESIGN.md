# Design System Document: The Digital Trailblazer

## 1. Overview & Creative North Star
This design system is built to empower the next generation of women entrepreneurs in India. Our Creative North Star, **"The Digital Trailblazer,"** rejects the timid "pastel" stereotypes of female-focused design. Instead, it embraces a high-contrast, sophisticated, and tech-forward aesthetic.

The experience is defined by **Intentional Asymmetry** and **Editorial Breathing Room**. We move away from the rigid, "boxed-in" feel of standard SaaS templates. By utilizing overlapping elements, glassmorphic layers, and bold typographic scales, we create a digital environment that feels like a premium editorial publication—authoritative yet innovative.

---

## 2. Colors & Surface Philosophy
The palette is anchored in deep authority (`primary`) and energized by high-voltage accents (`secondary` and `accent`).

### The "No-Line" Rule
To maintain a high-end, seamless feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly against a `background` or `surface` area to create a soft, natural break.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, stacked layers.
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Sections:** `surface-container-low` (#f2f4f6)
- **Interactive Cards/Containers:** `surface-container-lowest` (#ffffff)
- **Deep Insets:** `surface-container-highest` (#e0e3e5)

### The Glass & Gradient Rule
To move beyond "out-of-the-box" flat design, floating elements (modals, navigation bars, dropdowns) must use **Glassmorphism**.
- **Formula:** `surface-container-lowest` at 70% opacity + `backdrop-blur: 20px`.
- **Signature Textures:** Use a subtle linear gradient (45deg) from `secondary` (#712ae2) to `secondary-container` (#8a4cfc) for hero CTAs and primary action states. This adds "visual soul" and depth that a flat fill cannot achieve.

---

## 3. Typography
We use a dual-sans-serif approach to balance modern tech with editorial sophistication.

- **Display & Headline (Plus Jakarta Sans):** Chosen for its geometric precision and modern flair. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments to establish the "Trailblazer" persona.
- **Title & Body (Manrope):** A highly legible, versatile sans-serif. Manrope provides a functional "tech" feel that balances the expressive headlines.
- **Hierarchy as Identity:** Use extreme scale contrast. Pairing a `display-md` headline with a `label-md` uppercase caption creates an "Editorial" look that feels premium and curated.

---

## 4. Elevation & Depth
In this system, depth is a result of **Tonal Layering**, not structural lines.

### The Layering Principle
Achieve lift by stacking surface tiers. A `surface-container-lowest` card placed on a `surface-container-low` background provides enough contrast to be perceived as an object without needing a stroke.

### Ambient Shadows
Shadows are reserved for "Active" or "Floating" states only.
- **Spec:** Blur: 40px, Spread: -10px, Color: `on-surface` at 6% opacity.
- **Tinting:** Shadows should never be pure grey. They must be slightly tinted with the page's ambient tone to mimic natural light.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., input fields), use a **Ghost Border**: `outline-variant` (#c6c6cd) at 20% opacity. **Never use 100% opaque borders.**

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`secondary` to `secondary-container`), white text, `xl` (1.5rem) corner radius. Use a subtle `secondary` glow on hover.
- **Secondary:** Glassmorphic background (`surface-container-lowest` @ 20%) with a Ghost Border.
- **Tertiary:** Pure text using `secondary` color with an animated underline on hover.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Separation:** Use `spacing-8` (2.75rem) of vertical white space or shift from `surface` to `surface-container-low` to separate items.
- **Shape:** All cards must use `lg` (1rem) or `xl` (1.5rem) rounded corners to maintain the "Modern" style.

### Input Fields
- **Base:** `surface-container-low` background, no border, `md` corner radius.
- **Focus State:** 2px "Ghost Border" using `secondary` at 40% opacity and a subtle glow.
- **Labels:** Use `label-md` in `on-surface-variant` positioned 0.7rem above the input.

### Signature Component: The "Trailblazer" Progress Track
Instead of a standard stepper, use a vertical line with a `secondary` to `tertiary` (neon pink) gradient, utilizing `secondary-fixed` dots to signify milestones.

---

## 6. Do's and Don'ts

### Do:
- **Embrace White Space:** Use the `20` (7rem) and `24` (8.5rem) spacing tokens to let content breathe.
- **Layer with Glass:** Use backdrop-blurs on navigation bars to let background gradients bleed through.
- **Mix Weights:** Pair `display-lg` (Bold) with `body-md` (Regular) for maximum editorial impact.

### Don't:
- **Don't use 1px Dividers:** Use background color shifts or spacing instead.
- **Don't use "Pure" Black:** Use `primary-container` (#131b2e) for dark backgrounds to maintain the "Navy" brand soul.
- **Don't use Default Corners:** Avoid the `sm` (0.25rem) radius; it feels dated. Stick to `lg` or `xl` for a modern, friendly tech aesthetic.
- **Don't Over-shadow:** If everything floats, nothing is important. Use elevation sparingly.