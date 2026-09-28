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

## Content source
Text now comes verbatim from jnitinc.com wherever the page could be read
(marked in the markup with `CONTENT: verbatim from jnitinc.com/...` comments):

- About: hero, story, Mission & Vision, approach, strengths ("Why JNIT"), offerings
- Careers: the 3 openings (Senior DevOps Engineers, Senior Full Stack Developers,
  Senior Software Developers .NET), requirements and how to apply. The Full Stack and
  .NET descriptions follow the DevOps listing with their own technology lists; check them.
- Project Staffing, Contract Staffing, Recruiter on Demand: "The JNIT Approach" steps
- Digital Transformation and Product Development: all paragraphs
- "Types OF Resources" section on the staffing pages
- Address: 3145 Bordentown Avenue, Suite D1, Parlin, NJ 08859
- Home: strengths and offerings from the About page

Live-site wording kept as-is (fix if you want): "Let Us Your Elevate your business...",
"Digital Innovation" repeats the Global Talent text, and one sentence ends at "enhance financial".
The About FAQ on the live site is template text from another company, so it was left out.

## Still to replace before launch
jnitinc.com timed out for these pages, so they are placeholders (`.ph`, `REPLACE` comments):

1. **Logo and brand colors.** Replace the SVG in `header`/`footer` and `assets/logos/`,
   then set `--primary` / `--secondary` in `css/style.css`.
2. **Email, phone, hours** on contact.html and the footer; **social links** (currently `#`).
3. **Home page** hero and intro, **Services** overview, **Direct Staffing**, **Contract to Hire**,
   **RPO** and **Multi-Cloud DevOps** body copy.
4. **Placements / Clients served till 2024** figures on about.html (`[number]`).
5. **Blog posts** (blogs.html / blog-detail.html are samples) and **Privacy / Terms** text.
6. **Forms** simulate success. Connect them to a form service in `js/forms.js`.
