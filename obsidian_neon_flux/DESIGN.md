# Design System Specification: High-Density Tech-Noir CRM

## 1. Overview & Creative North Star: "The Kinetic Obsidian"
The Creative North Star for this system is **The Kinetic Obsidian**. This isn't just a dark mode; it is a high-performance engineering environment. It rejects the "flat" web aesthetic in favor of a multi-layered, tactile interface that mimics high-end aerospace glass cockpits. 

To break the "template" look, this system utilizes **Intentional Asymmetry**. Dashboards should not be perfectly mirrored grids; instead, use the spacing scale to create focal points where data "bleeds" into the margins, and use overlapping glass layers to suggest a continuous, living workspace. We achieve premium depth through tonal shifts and light-emission (glows) rather than primitive borders.

---

## 2. Colors: The Neon & The Void
The palette is rooted in `surface` (#0e0e0f), a deep obsidian that serves as the "infinite" canvas. Accents are treated as light sources, not just fills.

### Palette Strategy
*   **Primary (`#a1faff` Cyan):** Used for "Active Data" and system-critical paths.
*   **Secondary (`#d674ff` Purple):** Used for "Human Interaction" and CRM relationship metrics.
*   **Tertiary (`#f3ffca` Lime):** Reserved for "Growth" and positive financial delta.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for layout sectioning. Separation must be achieved by nesting `surface-container-low` on `surface`, or through a `0.5` spacing gap that reveals the `surface-container-lowest` background.
*   **Surface Hierarchy:**
    *   **Base:** `surface` (#0e0e0f)
    *   **Low Priority/Backgrounds:** `surface-container-low` (#131314)
    *   **Standard Cards:** `surface-container` (#1a191b)
    *   **Active/Elevated Elements:** `surface-container-highest` (#262627)
*   **The "Glass & Gradient" Rule:** Primary buttons and high-priority CRM cards must use a linear gradient (Primary to Primary-Container) at a 135° angle to simulate a light-emitting diode. Apply a `backdrop-blur` of 12px to any element using `surface-variant` at 60% opacity to create the signature glassmorphism effect.

---

## 3. Typography: Precision Engineering
We utilize a dual-font strategy to balance high-tech precision with editorial authority.

*   **Display & Headlines (Space Grotesk):** This typeface provides the "architectural" feel. Use `display-lg` for macro-data points (e.g., Total Pipeline Value) to give them a monumental presence.
*   **Body & Labels (Inter):** Inter handles the high-density CRM data. Its high x-height ensures readability at `body-sm` (0.75rem) for complex data tables.
*   **The "Monospace Fallback":** While not in the primary tokens, use a monospace font for all numerical figures in tables to ensure tabular alignment and a "terminal" aesthetic.
*   **Hierarchy:** Use `on-surface-variant` for metadata labels to create a clear visual recession, keeping the user focused on the high-contrast `on-surface` data.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "organic" for an engineering tool. We use **Tonal Layering** and **Luminance**.

*   **The Layering Principle:** To lift a "Lead Detail" panel, do not add a shadow. Instead, transition the background from `surface-container-low` to `surface-container-high`.
*   **Ambient Glows:** For "Floating" modals, use an ambient glow instead of a black shadow. Apply a shadow with a 40px blur using the `primary` color at 5% opacity. This mimics the glow of a screen in a dark room.
*   **The "Ghost Border":** For interactive inputs, use the `outline-variant` token at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** Navigation rails must use `surface-container-low` with a 0.8 alpha and a 20px blur. This ensures the high-density CRM data scrolls "underneath" the navigation, maintaining a sense of spatial depth.

---

## 5. Components: Functional Minimalism

### Buttons
*   **Primary:** Gradient from `primary` to `primary-container`. `rounded-sm` (0.125rem). Subtle `primary` outer glow on hover.
*   **Secondary:** Ghost style. `outline` token at 20% opacity. Text in `secondary`.
*   **Tertiary:** Text-only using `tertiary` color. All-caps, `label-md`.

### Input Fields
*   **Resting:** `surface-container-highest` background, no border, `rounded-sm`.
*   **Focus:** 1px "Ghost Border" using `primary` at 40% opacity. A subtle 2px bottom-border glow in `primary`.

### Cards & Data Lists
*   **Card Design:** Forbid dividers. Use `spacing-4` (0.9rem) to separate entries.
*   **Density:** In the CRM table, use `surface-container-low` for even rows and `surface-container` for odd rows to create "Zebra" striping without lines.
*   **High-Priority Data:** Use a `primary_dim` left-accent bar (2px width) to flag "Hot Leads."

### Signature CRM Component: The "Pulse Monitor"
*   A specialized sparkline component using `secondary` (Purple) for activity and `tertiary` (Lime) for conversion. Background is `surface-container-lowest`. This provides an immediate "health check" of a client account without reading text.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `rounded-sm` or `none` for a sharp, aggressive tech feel.
*   **Do** use `primary_fixed` for numeric data that needs to "pop" against the dark background.
*   **Do** leverage the `spacing-px` for ultra-fine alignment in data-heavy views.
*   **Do** use "thin-line" icons (0.5px to 1px stroke) to match the Inter typography weight.

### Don't
*   **Don’t** use standard "Grey" (#808080). Use `on-surface-variant` which is tuned to the obsidian base.
*   **Don’t** use `rounded-xl` or `rounded-full` for anything other than status chips; it breaks the "Engineering" aesthetic.
*   **Don’t** use 100% white (#FFFFFF) for long-form body text; use `on-surface` to reduce eye strain in dark environments.
*   **Don’t** use "Drop Shadows." If an element needs to stand out, use a color-shift or a light-emit glow.