# Adversarial review — M1 hi-fi HTML prototype

Cynical review of static files in `m1-hifi-prototype/` (HTML, CSS, JS) against the M1 hi-fi spec and PRD.

1. **Placeholder settings destinations** — Every `Settings` row uses `href="#"`; stakeholders may assume flows exist and waste time on dead links during usability tests.
2. **“Yours” recipe bait-and-switch** — After saving a custom recipe, `recipe-detail.html` still shows the seeded chicken bowl content, which undermines trust in the “add recipe” path.
3. **`alert()` on onboarding** — Step 3 validation uses a browser alert instead of inline `aria-live` error copy; it is jarring, not screen-reader-friendly, and below the bar for a WCAG-minded spec.
4. **Gear icon as emoji** — Settings entry uses a Unicode character; rendering varies by platform/font and may fail contrast or clarity compared to SVG icons used in the tab bar.
5. **Food-group emojis** — Same inconsistency as above; also mixes pictorial metaphors that may not localize or meet brand guidelines.
6. **Recipes segmented control** — Marked `role="tablist"` but there is no `role="tab"`, selected state, or panel association; assistive tech users get a misleading semantics tree.
7. **Stale safety banner never demonstrated** — The spec calls for a dismissible “profile updated” banner; it stays `hidden` with no prototype path to validate layout or copy.
8. **Fridge validation bypass** — Users can open `fridge-results.html` directly without ingredients, bypassing the empty-state and validation story entirely.
9. **Primary caregiver label without name** — Spec allows greeting with display name when available; prototype always omits it, so the “Good afternoon, [Caregiver]” pattern is untested.
10. **No explicit empty Today state page** — Empty state is described in the spec as part of `Today`; there is no dedicated demo toggle, so QA cannot snapshot that state without editing HTML.
11. **Toast + navigation race** — Meal save shows a toast then redirects; duration is short enough that many users will never perceive “Saved,” defeating the success feedback goal.
12. **Checkbox sizing** — Disclaimer “I understand” uses a 44×44 checkbox per CSS rule on `input`; visually it may dominate the layout and look unintentional versus a custom control.
13. **Legal footer on landing** — Privacy/Terms are inert `#` links; legal review may flag this as implying non-functional commitments.
