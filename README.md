# rhizomatica

A lightweight, dependency-free HTML / CSS / JS recreation of the
[rhizomatica.org](https://www.rhizomatica.org/) homepage. It focuses on the
visual design (layout, palette, typography, and interactions) rather than
content, and is intended to be hosted as a static site — for example on
GitHub Pages.

## Project structure

```
rhizomatica/
├── index.html          # Homepage: full-viewport hero + call to action
├── home_img.png        # Homepage hero background image
├── about.html          # About: history, mission, approach
├── who-we-are.html     # Who We Are: team, HERMES team, board, supporters
├── what-we-do.html     # What We Do: four strategies + projects
├── resources.html      # Resources: guides/manuals + video channels
├── videos-hf.html      # HF Radio: embedded video tutorials
├── blog.html           # Blog: post listing (links to the individual posts below)
├── blog/               # Individual blog post pages (10 posts, one file per post)
├── contact.html        # Contact: form (reCAPTCHA) + email address
├── contact.php         # Contact form handler (validates reCAPTCHA, sends email)
├── navbar.html         # Shared navigation partial (sidebar + mobile nav)
├── footer.html         # Shared footer partial
├── docs/               # Downloadable PDFs (guides and manuals)
├── css/
│   └── styles.css      # All styles (colors, fonts, layout, responsive rules)
├── js/
│   └── main.js         # Mobile menu, accordion, active nav, partial injection
├── .github/
│   └── workflows/
│       └── pages.yml   # GitHub Actions workflow that deploys to GitHub Pages
└── README.md
```

- **index.html** — semantic structure of the page. The orange logo is an inline
  SVG defined once as a `<symbol>` and reused with `<use>`.
- **Content pages** — one HTML file per top-level section (`about.html`,
  `who-we-are.html`, `what-we-do.html`, `resources.html`, `videos-hf.html`,
  `blog.html`, `contact.html`), each sharing the same navigation and content
  styles.
- **Blog posts** — each post is a standalone HTML page inside `blog/`, named
  after its original URL slug (for example
  `blog/5g-a-terminal-condition.html`), and linked from `blog.html`. Post images
  live in `images/blog/`.
- **navbar.html / footer.html** — shared partials injected into each page's
  `<div id="site-navbar">` / `<footer id="site-footer">` placeholder by
  `js/main.js`, so navigation and footer content live in one place.
- **css/styles.css** — the design system: the orange accent `#ED4E0F`, the gray
  sidebar `#EAEBEB`, Crimson Text / Source Sans typography, the fixed left
  sidebar, the full-viewport hero, and the mobile layout breakpoints.
- **js/main.js** — injects `navbar.html`/`footer.html`, opens/closes the mobile
  menu, highlights the active nav item, and powers the resources accordion.

## Running locally

Because there is no build step, you can open the site directly:

```bash
# Option 1 — open the file in a browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or serve it with a local static server (recommended, keeps paths clean):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> **Note:** the navbar and footer are loaded from `navbar.html` / `footer.html`
> via JavaScript, so the site needs to be served by a web server over HTTP or
> HTTPS (for example the `python3 -m http.server` option above, or GitHub
> Pages). Opening the files directly with the `file://` protocol will leave the
> navbar and footer empty.

## Publishing to GitHub Pages

This is a plain static site with no build tooling, so the easiest approach is
GitHub's "deploy from a branch" option.

### Option A — Deploy from a branch (recommended)

1. Create a repository on GitHub and push the project to it:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub, open the repository and go to **Settings → Pages**.

3. Under **Build and deployment**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `master`)
   - **Folder:** `/ (root)`

4. Click **Save**. After a minute or two the site will be live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

> Note: if the repository is named `<your-username>.github.io`, the site will be
> served directly at `https://<your-username>.github.io/` instead.

### Option B — Deploy with GitHub Actions

A ready-to-use workflow is included at
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes the
repository root on every push to `main` (and on manual runs) using the official
`actions/configure-pages`, `actions/upload-pages-artifact`, and
`actions/deploy-pages` actions.

To use it:

1. Push the repository to GitHub (the workflow file is already in place).
2. Open **Settings → Pages** and set **Source** to `GitHub Actions`.

## Contact form

The contact page (`contact.html`) uses **Google reCAPTCHA v2** and posts to
`contact.php`, which validates the captcha server-side and emails the message.

To activate it:

1. Get a reCAPTCHA **site key** and **secret key** from
   [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin).
2. Put the **site key** in `contact.html` (replace `YOUR_RECAPTCHA_SITE_KEY`).
3. Put the **secret key** in `contact.php` (replace `YOUR_RECAPTCHA_SECRET_KEY`),
   and set `$recipient` and `$from` to your real addresses.

> **Important:** `contact.php` needs a PHP-enabled web server. GitHub Pages only
> serves static files and will **not** run PHP, so the contact form must be
> hosted on a server with PHP (shared hosting, VPS, etc.). The rest of the site
> can remain on GitHub Pages.

## Customizing

- **Hero image** — the homepage background uses `home_img.png` (with a dark
  overlay applied in `css/styles.css`). To swap it, replace that file or update
  the `url()` in the `.hero-bg` rule.
- **Colors / fonts** — all values are CSS custom properties at the top of
  `css/styles.css`, so you can re-theme the whole site in one place.
- **Navigation** — the menu items in `index.html` currently link to `#`. Point
  them at real pages as content is added.
