# rhizomatica

A lightweight, dependency-free HTML / CSS / JS recreation of the
[rhizomatica.org](https://www.rhizomatica.org/) homepage. It focuses on the
visual design (layout, palette, typography, and interactions) rather than
content. There is no build step: the site is a set of plain static files plus a
small PHP script (`contact.php`) that handles the contact form, and it is
published by uploading the files to a PHP-enabled web server over FTP.

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
├── contact.html        # Contact: form (Cloudflare Turnstile) + email address
├── contact.php         # Contact form handler (validates Turnstile, sends email)
├── navbar.html         # Shared navigation partial (sidebar + mobile nav)
├── footer.html         # Shared footer partial
├── docs/               # Downloadable PDFs (guides and manuals)
├── css/
│   └── styles.css      # All styles (colors, fonts, layout, responsive rules)
├── js/
│   └── main.js         # Mobile menu, accordion, active nav, partial injection
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
> HTTPS (for example the `python3 -m http.server` option above, or your FTP
> host). Opening the files directly with the `file://` protocol will leave the
> navbar and footer empty.

## Publishing via FTP

The site is published by uploading the files to a PHP-enabled web server over
FTP (shared hosting, VPS, etc.). There is no build step and no deployment
pipeline — the files on the server are the live site.

### What to upload

Upload everything in the project root, preserving the folder structure. The
only files to skip are development-only and should never live on the server:

- `.git/` — local version-control data
- `.github/` — GitHub-only configuration
- `README.md` — documentation


Everything else is required by the live site, including:

- `home_img.png` — referenced by `css/styles.css` as the hero background
- `docs/` — the downloadable PDF guides linked from `resources.html`
- `navbar.html` / `footer.html` — fetched by the pages via JavaScript, so they
  must sit in the same directory as the HTML pages
- `contact.php` — the contact form handler (the host must run PHP)

### Steps

1. In your FTP client, connect to the host and open the web root (often
   `public_html/`, `www/` or `htdocs/`).
2. Upload the **contents** of the repository root (not the enclosing
   `rhizomatica/` folder) into the web root, keeping the `css/`, `js/`,
   `docs/`, `blog/` and `images/` folders intact.
3. Configure the contact form (see below), then open the site in a browser and
   submit a test message to confirm everything works.

> **Tip:** if your FTP client has a synchronize/mirror mode, use it so future
> edits only upload the files that changed.

## Contact form

The contact page (`contact.html`) uses **Cloudflare Turnstile** and posts to
`contact.php`, which verifies the Turnstile token server-side and emails the
message.

To activate it:

1. Create a **Turnstile** widget in the
   [Cloudflare dashboard](https://dash.cloudflare.com/) and copy the **site
   key** and **secret key**. Add your domain(s) (for example `rhizomatica.org`
   and `www.rhizomatica.org`) to the widget's hostname list.
2. Put the **site key** in `contact.html` (replace `YOUR_TURNSTILE_SITE_KEY`).
3. Put the **secret key** in `contact.php` (replace
   `YOUR_TURNSTILE_SECRET_KEY`), and set `$recipient` and `$from` to your real
   addresses.

> **Important:** `contact.php` needs a PHP-enabled web server. Because the site
> is published to a PHP host over FTP, the contact form lives on the same
> server as the rest of the site — no separate setup is needed.
>
> Keep the **secret key** server-side only: never put it in an `.html` file or
> anywhere it could be downloaded publicly.

## Customizing

- **Hero image** — the homepage background uses `home_img.png` (with a dark
  overlay applied in `css/styles.css`). To swap it, replace that file or update
  the `url()` in the `.hero-bg` rule.
- **Colors / fonts** — all values are CSS custom properties at the top of
  `css/styles.css`, so you can re-theme the whole site in one place.
- **Navigation** — the menu lives in `navbar.html`, which is injected into every
  page by `js/main.js`; edit it once to update the whole site's menu.
