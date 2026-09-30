# Student portal design book

Brand and UI rules for the MCQ Analysis student web app. Auth screens are the first consumer of this system.

## Brand

| Token | Value | Usage |
| --- | --- | --- |
| Primary | `#1F4F43` | Primary buttons, links, focus accents |
| Primary hover | `#183E35` | Button hover |
| Primary pressed | `#122F28` | Button active |
| Primary soft | `#E7F0ED` | Subtle backgrounds, badges |
| Focus ring | `rgba(31, 79, 67, 0.35)` | Input and button focus |

## Typography

- **Family:** Poppins (400, 500, 600, 700) via `next/font/google`
- **Body:** 16px / 1.5, weight 400, color ink
- **Label:** 14px / 1.4, weight 500, color ink
- **Hint / helper:** 13px / 1.4, weight 400, color muted
- **Page title:** 24px / 1.25, weight 600, color ink
- **Section title:** 18px / 1.3, weight 600, color ink

## Color (semantic)

| Token | Hex | Tailwind |
| --- | --- | --- |
| Ink | `#14221E` | `text-ink` |
| Muted | `#5C6B66` | `text-muted` |
| Line | `#D7E0DC` | `border-line` |
| Page | `#F4F7F6` | `bg-page` |
| Card | `#FFFFFF` | `bg-card` |
| Danger | `#B42318` | `text-danger` |
| Danger soft | `#FDECEC` | `bg-danger-soft` |

The app uses a **single light theme** only. There is no dark mode: CSS defines `:root` tokens only (no `.dark` block), and `html` uses `color-scheme: light`. shadcn/ui components read the same tokens (`--primary`, `--background`, `--card`, etc.).

## Spacing and radius

- **Auth card max width:** 420px
- **Card padding:** 32px (mobile: 24px)
- **Stack gap between fields:** 16px
- **Stack gap title to form:** 24px
- **Input height:** 44px
- **Button height:** 44px
- **Border radius (inputs, buttons, card):** 10px
- **Page horizontal padding:** 16px

## Auth layout

```
┌─────────────────────────────────────────┐
│  bg-page (full viewport, min-height)    │
│         ┌───────────────────┐           │
│         │  card (white)     │           │
│         │  logo / title     │           │
│         │  subtitle         │           │
│         │  form fields      │           │
│         │  primary CTA      │           │
│         │  secondary link   │           │
│         └───────────────────┘           │
└─────────────────────────────────────────┘
```

- Content is vertically and horizontally centered on `bg-page`.
- One primary action per step; secondary actions are text links below the button.
- Form-level errors use `Alert` (danger soft background, danger text).

## Components (visual spec)

### Button

- **Primary:** `bg-primary`, white label, medium weight; hover `primary-hover`; disabled 50% opacity.
- **Secondary:** white background, `border-line`, ink label; hover `bg-primary-soft`.
- **Ghost:** no border; ink label; hover `bg-primary-soft`.

### Text field

- Full width, 44px height, 1px `border-line`, radius 10px, horizontal padding 14px.
- Focus: `border-primary`, focus ring token.
- Error: `border-danger`, error message below in danger color.

### Password field

- Same shell as text field; trailing toggle for show/hide (icon button, no border).

### Phone field

- Same as text field; `inputMode="numeric"`; digits only; Bangladesh mobile format in copy (11 digits starting with 01).

### OTP input

- Six single-digit boxes in a row, equal width, gap 8px, centered in the card.

## Motion

- Transitions: 150ms ease for background, border, and opacity on interactive elements.
- No decorative animation on auth v1.

## Accessibility

- Visible focus rings on all interactive elements.
- Labels associated with inputs; errors linked via `aria-describedby`.
- Primary button `type="submit"`; loading state disables submit and sets `aria-busy`.

## Implementation reference

Tokens are defined in [app/globals.css](../app/globals.css) and Poppins is loaded in [app/layout.tsx](../app/layout.tsx).
