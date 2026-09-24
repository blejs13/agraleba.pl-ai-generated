# agraleba.pl

A lightweight, configuration-driven brochure website for Zielony Ogrod, a seaside guest accommodation property in Leba, Poland.

The website presents the property, rooms, amenities, pricing, photographs, and contact information. Its purpose is to help visitors understand the offer and contact the property directly. It is not a booking platform or a web application with user accounts.

## Project Status

This initial commit contains the project brief only. The implementation and assets will be introduced in subsequent commits. Any existing local HTML prototype is exploratory and is not the approved production implementation.

The sections below define the intended architecture and implementation requirements, not a claim that these features are already complete.

## Design Goals

- Keep hosting costs and ongoing maintenance low.
- Separate editable content from page structure, styling, and behavior.
- Make routine changes possible by editing a single configuration file.
- Provide a clear, responsive, accessible visitor experience.
- Avoid a database, application server, CMS, or administration dashboard.
- Keep dependencies and tooling proportional to a small informational website.

The public website has normal visitor-facing navigation and interactions. There is no browser-based content editor, login area, or account management interface.

## Architecture

Use semantic HTML, responsive CSS, and a small vanilla JavaScript rendering layer. No frontend framework or mandatory build step is required for the baseline implementation.

| File or directory | Responsibility |
| --- | --- |
| `index.html` | Page structure, section templates, metadata, and essential fallback content |
| `styles.css` | Layout, typography, responsive behavior, and visual states |
| `site.config.js` | Public content, asset references, links, and module visibility settings |
| `app.js` | Configuration validation, DOM updates, conditional rendering, and small interactions |
| `assets/` | Selected photographs, logos, and other assets used by the new website |

Load `site.config.js` before `app.js`, using deferred scripts. The configuration exposes a plain data object such as `window.SITE_CONFIG`. The rendering script reads that object, updates text and attributes, renders repeated items, and determines which modules are visible.

Content changes must not require editing the HTML templates or rendering logic. Configuration is public client-side data: it must never contain credentials, private customer information, or other secrets.

## Configuration and Modules

Supported content areas should include property identity, the introductory section, rooms, amenities, pricing, a gallery, location, and contact details. Optional modules have their own `enabled` flag and content fields.

The renderer must apply these rules consistently:

1. Render an optional module only when it is configured, explicitly enabled, and has the data required for that module.
2. Omit missing or disabled modules without leaving empty headings, containers, or layout gaps.
3. Hide navigation entries and in-page links whose target module is not displayed.
4. Omit empty optional fields and links. Do not generate blank buttons or broken image placeholders.
5. Validate the configuration before rendering. Report actionable diagnostics for malformed data without breaking unrelated modules.
6. Treat content as text by default. Use safe DOM APIs and validate URL protocols rather than interpolating configuration values into raw HTML.

For example, a gallery needs at least one valid image, while pricing may contain either approved rates or an explicit request-for-quote message. Do not invent prices or publish unverified property information to fill an empty section.

Illustrative configuration excerpt:

```javascript
window.SITE_CONFIG = {
  site: {
    name: "Zielony Ogrod",
    description: "Guest accommodation in Leba, Poland."
  },
  about: {
    enabled: true,
    heading: "About the property",
    text: "Property description approved by the owner."
  },
  pricing: {
    enabled: true,
    heading: "Pricing",
    note: "Contact the property for a quote.",
    rows: []
  },
  gallery: {
    enabled: false,
    images: []
  }
};
```

This example demonstrates the content model; it is not a complete production configuration. Website copy may be in Polish even though developer documentation is in English.

## Scope and Quality Requirements

- Responsive layouts that remain readable on small mobile screens and desktop displays.
- Accessible navigation, keyboard-operable controls, visible focus states, and descriptive image alternatives.
- Optimized photographs with stable dimensions and lazy loading below the first viewport.
- Lightweight interactions such as a mobile menu and image viewer, without unnecessary application state or routing infrastructure.
- Descriptive metadata, a canonical URL, and appropriate structured data for the property.
- Essential identity and contact information available as an HTML fallback if JavaScript fails. Configuration-driven sections otherwise depend on JavaScript; fully prerendered content can be evaluated separately if required for search visibility.
- External maps, analytics, or other third-party integrations added only when needed, with their privacy implications reviewed.

User registration, an administration panel, payments, live availability, a reservation engine, and backend form processing are outside the initial scope. Enquiries should use approved phone, email, or external booking links.

## Content and Asset Reference

The previous Angular website is available at [blejs13/agraleba](https://github.com/blejs13/agraleba). It is a reference for existing content, photographs, and logos, not the codebase for this implementation.

The initial reference revision is `2f3438534261bab92362f4563f06a4db81814d8f`. Keep the reference checkout separate from this repository. Copy only selected, reviewed assets needed for the new website; do not import the Angular application, its dependencies, build configuration, deployment files, or Git history.

Before publishing, confirm that the owner approves the content and asset usage. Retain applicable licenses for third-party assets.

Photo filenames use a category and a two-digit index: `pokoj-01.jpg`, `lazienka-01.jpg`, `ogrod-01.jpg`, `ceramika-01.jpg`, `altana-01.jpg`, or `wejscie-01.jpg`. Mobile variants keep the same filename in their mobile directory. Continue the numbering within each category; retain the established names for logos, icons, and the social preview.

## Maintenance and Deployment

### Local prototype configuration

`map`, `payment`, `garden`, and `reviews` are optional modules in `site.config.js`, each controlled by `enabled`. The Google map loads automatically when enabled, without a consent button; a privacy notice remains below it. This contacts Google and transmits the visitor's IP address on page load, so review privacy requirements before publication. The embed uses zoom 10 and center 54.735, 17.50 for a regional view of Leba and lakes Lebsko and Sarbsko while retaining the property marker. The directions link works independently. Payment details were transcribed from the legacy website and must be reconfirmed with the owner before publication.

Reviews are supplied manually in `reviews.items`; there is no scraping or live Booking integration. Each item requires `text`, `source` (for example, `Booking.com`), and either numeric `score` with positive `maxScore`, or an integer `stars` from 1 to 5; `author` is optional. Numeric scores must be between zero and `maxScore` and take precedence over stars. Booking reviews retain their original ten-point scale.

The five current quotes and the Booking aggregate of 8.3/10 from 54 reviews were supplied by the user on 2026-09-24, not independently fetched. `reviews.summary` stores `score`, `maxScore`, `count`, and `source`; update these manually as the external rating changes. This aggregate is independent of the five selected quotes. The garden description includes the owner's ceramics studio and ceramic decorations on the walls and among the plants.

`reviews.intervalMs` is currently set to 5000 ms (the minimum and fallback remain 3000 ms), measured between transition starts. Reviews crossfade over 1.2 seconds, rotate automatically in random order without immediate repeats, and have no navigation buttons. Rotation pauses while hovered, keyboard-focused, off-screen, or in a background tab. The review text can receive keyboard focus to pause reading. A single review stays static; empty or invalid lists hide the section and its navigation link. Autoplay is disabled while reduced motion is preferred.

Sections reveal once when scrolled into view. Reduced-motion preferences disable reveal animations. No external animation library is required. The implementation checklist is in `UPDATE-PLAN.md`.

`rooms.image` defines the single room photograph using `src`, optional `mobileSrc`, and `alt`. `rooms.amenityGroups` contains headings and lists of amenities, displayed beside the photograph on desktop and below it on mobile.

`gallery.images` defines the ordered slides using `src`, optional `mobileSrc`, `alt`, and `caption`. The native scroll-snap carousel supports touch swipes, previous/next buttons, arrow keys, Home/End, and a click-to-enlarge dialog. It does not autoplay. Empty galleries are hidden; duplicate source paths and photographs used in other enabled sections are excluded. Keep one canonical path per photograph, as differently named copies cannot be detected at runtime. The current gallery includes 29 unique photographs: 14 new property photographs followed by 15 legacy photographs. The former ninth legacy slide is now the contact section background.

Room, garden, contact, and gallery photographs use lazy loading and `<picture>` mobile sources at widths up to 700 px. `contact.image` uses `src`, optional `mobileSrc`, and `alt`; it fills the full-width contact section behind the content, with cover cropping and a 58% black overlay for white text. The background is decorative and hidden from assistive technology; section height follows its content. Gallery frames retain stable dimensions and show the full photograph, including portrait images. The larger image is selected above that breakpoint; the fullscreen dialog reuses the selected variant.

The 16 photographs imported on 2026-09-24 live in `assets/images/{ogrod,ceramika}-NN.jpg`, with matching mobile copies in `assets/images/mobile/`. Progressive JPEGs have a maximum edge of 1800 px (desktop) or 900 px (mobile), are converted to sRGB, and have no EXIF metadata. Both sets together occupy about 9.2 MB instead of 131 MB of originals. The garden section uses `ogrod-09.jpg`, `ceramika-02.jpg`, and legacy photograph `ogrod-05.jpg` in that order, in portrait 2:3 frames. The second frame uses `object-position: 80% center` to keep the wall ceramics visible. The remaining 14 new photographs open the gallery. Original files were verified against a backup outside this repository before moving the import folder out; they are not deployment assets.

### Search and sharing metadata

The production URL is assumed to be `https://agraleba.pl/`. `index.html` contains a static title, description, canonical URL, Open Graph and Twitter Card metadata, favicon links, and `LodgingBusiness` JSON-LD. These are deliberately present without JavaScript so search and sharing crawlers can read them. When changing the property identity, phone, address, domain, or social links in configuration, also update the corresponding static metadata and HTML fallback content. Keep the canonical URL consistent with `robots.txt` and `sitemap.xml`.

`favicon.ico` includes 16/32/48 px sizes; the PNG favicon is 48 px and the Apple touch icon is 180 px. All use the existing logo. `assets/images/social-preview.jpg` is a 1200 x 630 crop of the new property photograph. Booking ratings are not included in structured data. No prices, opening hours, or other unconfirmed facts are generated.

Before publication, confirm the preferred host, redirect HTTP and alternate hosts to its HTTPS canonical URL, and review redirects from legacy Angular routes. Deploy `robots.txt`, `sitemap.xml`, `favicon.ico`, and the referenced image assets at their documented paths. Protect staging environments from indexing at the host level. After approved deployment, check the live page in Google Search Console and Rich Results Test and submit the sitemap. Local checks cannot confirm indexing, server responses, or social preview caches.

The intended maintenance workflow is:

1. Update the configuration and, when necessary, the referenced image files.
2. Preview the site locally and verify content, module visibility, links, and mobile layout.
3. Commit the reviewed changes.
4. Publish the static files to an HTTPS-enabled host after deployment approval.

No database migrations, server-side runtime, or background services are required. Future setup and deployment commands should be documented alongside the implementation once the hosting workflow is selected.