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

## Maintenance and Deployment

The intended maintenance workflow is:

1. Update the configuration and, when necessary, the referenced image files.
2. Preview the site locally and verify content, module visibility, links, and mobile layout.
3. Commit the reviewed changes.
4. Publish the static files to an HTTPS-enabled host after deployment approval.

No database migrations, server-side runtime, or background services are required. Future setup and deployment commands should be documented alongside the implementation once the hosting workflow is selected.