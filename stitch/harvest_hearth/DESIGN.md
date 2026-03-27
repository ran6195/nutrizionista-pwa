# Design System Specification: Editorial Nourishment

## 1. Overview & Creative North Star
**The Creative North Star: "The Modern Apothecary"**

This design system rejects the clinical, sterile aesthetic common in health apps. Instead, it adopts the persona of a high-end, nutritionist-led editorial magazine. We move beyond the "template" look by prioritizing **intentional asymmetry**, **tonal depth**, and **breathable compositions**. 

The UI should feel like a physical space—a sun-drenched kitchen with terracotta tiles and fresh herbs. We achieve this by breaking the rigid grid; hero images of meals should bleed off-edge, and typography should vary in scale to create a clear, authoritative narrative. This is not just a tool; it is a guided culinary experience.

---

## 2. Colors & Surface Architecture
The palette is rooted in earthiness, utilizing `primary` (Terracotta) and `tertiary` (Leaf Green) to create a sense of organic vitality against a `surface` (Creamy Beige) backdrop.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited.** To define sections, designers must use background color shifts. 
- Use `surface_container_low` (#f6f3ee) for large background sections.
- Use `surface_container` (#f0ede8) to define "active" or "highlighted" content areas within that section.
- This creates a sophisticated, "soft-ui" look that feels more natural and less "engineered."

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked fine papers. 
- **Base Layer:** `surface` (#fcf9f4).
- **Secondary Sectioning:** `surface_container_low` (#f6f3ee).
- **Interactive Cards:** `surface_container_lowest` (#ffffff) to provide a clean, high-contrast surface for recipe text.

### The "Glass & Gradient" Rule
To add soul to the "flat" PWA environment:
- **CTAs:** Use a subtle linear gradient from `primary` (#9d3e1d) to `primary_container` (#bd5533) at a 135° angle.
- **Floating Navigation:** Use `surface` (#fcf9f4) at 80% opacity with a `backdrop-blur` of 12px. This ensures the warm tones of the meal suggestions bleed through the interface, maintaining a sense of place.

---

## 3. Typography
The system utilizes two modern sans-serifs to balance authority with approachability.

*   **Display & Headlines:** `plusJakartaSans`. This face is used for high-impact editorial moments. The generous x-height and modern apertures convey a professional, nutritionist-guided tone.
*   **Body & Labels:** `beVietnamPro`. Chosen for its exceptional readability at small sizes on mobile screens. It feels human and warm, perfect for ingredient lists and nutritional advice.

**Hierarchy Strategy:**
- **The Power Gap:** Create high contrast between `display-lg` (3.5rem) for daily calorie goals and `body-sm` (0.75rem) for metadata. This "Editorial Gap" is what makes the design feel premium rather than generic.

---

## 4. Elevation & Depth
We eschew traditional Material Design shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** A recipe card (`surface_container_lowest`) sitting on a meal plan background (`surface_container_low`) creates a natural "lift" through color value alone.
*   **Ambient Shadows:** If a floating action button or modal requires a shadow, use a large blur (24px) at 6% opacity, tinted with `primary` (#9d3e1d) rather than black. This mimics natural light reflecting off terracotta surfaces.
*   **The "Ghost Border" Fallback:** For accessibility in form fields, use `outline_variant` (#ddc0b8) at 20% opacity. Never use a 100% opaque border.
*   **Softness:** Adhere to the `xl` (1.5rem) corner radius for all main containers to maintain the "friendly" and "approachable" brand promise.

---

## 5. Components

### Buttons & Interaction
- **Primary Action:** Rounded `full` (9999px). Uses the Terracotta gradient. Text is `on_primary` (#ffffff) in `title-sm` weight.
- **Secondary (Nutritional Tags):** Use `secondary_container` (#febb8e) with `on_secondary_container` (#794925) text. No border.

### Editorial Recipe Cards
- **Construction:** Forbid the use of dividers. Use `3` (1rem) spacing between the image and the title, and `1.5` (0.5rem) between the title and the "Time to Cook" label.
- **Visuals:** Images should use a `lg` (1rem) corner radius. For a signature look, allow meal images to slightly overlap the card's edge (using negative margins) to break the boxy feel.

### Input Fields & Search
- **Styling:** `surface_container_high` (#ebe8e3) background with no border. 
- **Focus State:** Transition the background to `surface_container_lowest` (#ffffff) and add a 2px `surface_tint` (#a0401f) "Ghost Border" at 30% opacity.

### Progress & Tracking (The "Leaf" Indicator)
- **Design:** Use `tertiary` (#36663e) for health-positive progress bars. Use a "Soft-Cap" design (rounded ends) to match the friendly feel.

---

## 6. Do’s and Don’ts

### Do:
- **Use "White Space" as a Tool:** Use `8` (2.75rem) to `12` (4rem) spacing between major sections to let the content breathe.
- **Embrace Asymmetry:** Align text to the left but allow images to float or align to the right to create an editorial layout.
- **Use Tonal Shifts:** Always check if a background color change can replace a line or a shadow.

### Don’t:
- **No Hard Black:** Never use #000000. Use `on_surface` (#1c1c19) for all "black" text to maintain the warm, organic feel.
- **No 1px Dividers:** Do not use horizontal rules to separate ingredient list items. Use `body-md` for the item and `label-sm` for the measurement, separated by vertical whitespace (`1.5`).
- **No Sharp Corners:** Avoid the `none` or `sm` roundedness tokens unless for very specific technical constraints. The brand is "Soft" and "Friendly."

### Accessibility Note:
Ensure that all `on_primary` and `on_tertiary` combinations meet WCAG AA standards. The `primary` (#9d3e1d) has been tuned for high legibility against the `surface` cream backgrounds.