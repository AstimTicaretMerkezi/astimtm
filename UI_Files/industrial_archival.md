---
name: Industrial Archival
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#ab2f00'
  on-secondary: '#ffffff'
  secondary-container: '#d63d00'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191e00'
  on-tertiary-container: '#7a8c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3a0a00'
  on-secondary-fixed-variant: '#862300'
  tertiary-fixed: '#d2f000'
  tertiary-fixed-dim: '#b8d300'
  on-tertiary-fixed: '#191e00'
  on-tertiary-fixed-variant: '#414c00'
  background: '#faf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
  ink-black: '#111111'
  bone-white: '#F4F3F0'
  industrial-orange: '#FF4A00'
  acid-green: '#DFFF00'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '900'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.02em
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
  meta-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
spacing:
  grid-line: 1px
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  gutter: 0px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built on the principles of **Neo-Brutalism** and **Swiss International Style**, emphasizing utility, structural honesty, and archival logic. The visual narrative treats the interface not as a decorative surface, but as a functional technical document or a digital file cabinet.

The emotional response should be one of "raw precision"âit feels established, authoritative, and unapologetically direct. By utilizing visible grid lines and high-contrast typography, the system removes all ambiguity, presenting information with industrial clarity. This is a "no-frills" aesthetic where the layout itself serves as the primary graphic element.

## Colors

The palette is anchored by a high-contrast relationship between **Ink Black** and **Bone White**. This pairing mimics the tactile feel of printed matter on unbleached paper.

- **Primary:** Used for all structural lines, borders, and main headlines.
- **Secondary (Industrial Orange):** Reserved for high-priority actions, critical alerts, and active states. It signals industrial urgency.
- **Tertiary (Acid Green):** A digital-native highlight used for environmental data, secondary tags, or "meta" information that requires a modern edge.
- **Neutral:** The organic background color that provides a softer, archival feel compared to pure white, reducing eye strain in high-contrast environments.

## Typography

Typography is the structural backbone of this system. It employs a triple-font hierarchy:

1.  **Headlines (Hanken Grotesk):** Set in Extra Bold/Black weights with tight tracking. On desktop, headlines should feel massive and architectural.
2.  **Body (Inter):** A neutral, highly legible sans-serif for long-form content, maintaining a clean Swiss aesthetic.
3.  **Metadata (Space Mono):** Used for UI labels, data points, timestamps, and technical descriptions. This font reinforces the archival, industrial nature of the system.

Negative letter-spacing should be applied to large headlines to create a dense, "blocky" visual impact.

## Layout & Spacing

The layout is governed by a **visible 1px grid**. Unlike traditional systems where grids are invisible guides, here the grid is a literal UI element.

- **Grid Model:** A strict 12-column grid for desktop. Columns and rows are separated by `1px solid #111111` lines.
- **Gutters:** Standard gutters are eliminated (0px). Content is separated by the grid lines themselves, creating a "tiled" or "table-like" appearance.
- **Padding:** Internal padding within grid cells should be consistent (e.g., 24px) to ensure content doesn't touch the borders.
- **Mobile:** Transition to a single-column stack where every element is encased in a full-width box defined by black borders.

## Elevation & Depth

This system rejects shadows and blurs in favor of **Structural Flatness**. Depth is conveyed through:

- **Bold Borders:** All containers, cards, and sections are defined by `1px` or `2px` solid black borders.
- **Tonal Stacking:** Different sections can use the `Bone White` or `Acid Green` backgrounds to denote hierarchy, but they always remain on the same perceived 2D plane.
- **The Invert Hover:** Interactivity is signaled by a total color inversion (Black becomes White/Orange) rather than a lift or shadow.
- **Grid Layering:** Elements may occasionally overlap grid lines to create a "pasted-on" archival feel, but no drop shadows should be used.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI elementâincluding buttons, input fields, cards, and tagsâmust have 90-degree corners. This reinforces the industrial, brutalist aesthetic and ensures that all elements align perfectly with the 1px grid system. No exceptions for "softness" are permitted; the structure must feel rigid and engineered.

## Components

### Buttons
- **Primary:** Solid `#111111` background with `#F4F3F0` text. Sharp corners. Mono font for the label.
- **Action/Accent:** Solid `#FF4A00` background.
- **Hover State:** Immediate inversion of colors. No transition ease.

### Cards
- Defined by a `1px` black border. No shadow. 
- The card header is separated from the body by a horizontal `1px` line.
- Content inside follows a strict vertical stack.

### Inputs & Form Fields
- Underlined or fully boxed with `1px` black lines.
- Labels use `Space Mono` in uppercase.
- Focus state: The border weight increases to `2px` or changes to `#FF4A00`.

### Chips & Tags
- Rectangular boxes with `1px` borders.
- Use `Acid Green` for data-heavy tags or status indicators.
- Use `Space Mono` at small sizes.

### Lists
- Each list item is separated by a horizontal `1px` line.
- Bullet points are replaced by technical indices (e.g., 01, 02, 03) in Monospace.