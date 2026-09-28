# JNIT Inc — 2026 Website (static HTML/CSS/JS)

Open `index.html` in a browser. No build step, no backend, no frameworks.
External dependency: Google Fonts only (Plus Jakarta Sans + Space Grotesk).

## Pages
index, about, services, direct-staffing, project-staffing, contract-staffing,
contract-to-hire, recruitment-process-outsourcing, recruiter-on-demand,
multi-cloud-devops, digital-transformation, product-development, careers,
blogs, blog-detail, contact, signup, plus privacy and terms (footer links).

## Structure
- `css/style.css` design tokens (`:root`) and all components
- `css/animations.css` reveal system, keyframes, reduced-motion rules
- `css/responsive.css` breakpoints (1280 / 1120 nav / 1024 / 900 / 767 / 430 / 380)
- `js/navigation.js` sticky header, Services dropdown, mobile menu
- `js/animations.js` scroll reveal, counters, timelines, sequences, parallax, magnetic buttons, hero canvas
- `js/main.js` page transitions, blog search/filter, job filter + modal, recruiter slider
- `js/forms.js` validation, password toggle + strength, success states
- `assets/logos/` placeholder logo files (mark, dark, white)

Hero and infographic visuals are inline animated SVG, so there are no image files to load.

## Must replace before launch
jnitinc.com could not be reached from the build environment, so these items are
placeholders and are marked in the markup (`.ph`, `.ph-note`, `REPLACE` / `CONTENT` comments):

1. **Logo and brand colors.** The logo is a placeholder mark. Replace the SVG in
   `header`/`footer` and `assets/logos/`, then set `--primary` / `--secondary` in
   `css/style.css` to the official logo colors.
2. **Contact details.** Email, phone, street address and hours. Location shows
   "Parlin, New Jersey" from a public directory listing; please confirm.
3. **Social links** in the footer (currently `#`).
4. **Service page copy.** Written to match JNIT's positioning; compare against each
   service page on jnitinc.com and paste the original text where it differs.
5. **About story** (founding, HQ, milestones), careers culture and benefits.
6. **Job listings** on careers.html are samples.
7. **Blog posts** on blogs.html / blog-detail.html are samples; use the posts from
   jnitinc.com/category/blog.
8. **Privacy Policy and Terms** pages contain placeholder text.
9. **Forms** simulate success. Connect them to a form service or endpoint in `js/forms.js`.

The home intro paragraph and the service names are JNIT's own wording.
Statistics use only counts that follow from the site itself (3 technology practices,
6 talent solutions); no business metrics were invented.
