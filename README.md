# Remix of Content Hub

**Use inspiration from the screenshot**
# Content Hub




Site Name: Content Hub

Tagline: ___________




## Design System




Base: shadcn/ui neutral (oklch)

Primary: systemBlue (#0071e3 / #009aff)

Destructive: systemRed (#e30000 / #ff453a)




Tint usage: bg-primary/30, border-primary/50, text-primary/70




Typography:

  Heading: Satoshi (fontshare.com)

  Body: Satoshi (fontshare.com)

  Weights: 700 headings, 400 body




```css

:root {

  --radius: 0.625rem;

  --background: oklch(1 0 0);

  --foreground: oklch(0.145 0 0);

  --card: oklch(1 0 0);

  --card-foreground: oklch(0.145 0 0);

  --popover: oklch(1 0 0);

  --popover-foreground: oklch(0.145 0 0);

  --secondary: oklch(0.97 0 0);

  --secondary-foreground: oklch(0.205 0 0);

  --muted: oklch(0.97 0 0);

  --muted-foreground: oklch(0.556 0 0);

  --border: oklch(0.922 0 0);

  --input: oklch(0.922 0 0);

  --ring: oklch(0.708 0 0);




  --primary: #0071e3;

  --primary-foreground: #fff;




  --destructive: #e30000;

  --destructive-foreground: #fff;

}




.dark {

  --background: oklch(0.145 0 0);

  --foreground: oklch(0.985 0 0);

  --card: oklch(0.205 0 0);

  --card-foreground: oklch(0.985 0 0);

  --popover: oklch(0.269 0 0);

  --popover-foreground: oklch(0.985 0 0);

  --secondary: oklch(0.269 0 0);

  --secondary-foreground: oklch(0.985 0 0);

  --muted: oklch(0.269 0 0);

  --muted-foreground: oklch(0.708 0 0);

  --border: oklch(1 0 0 / 10%);

  --input: oklch(1 0 0 / 15%);

  --ring: oklch(0.556 0 0);




  --primary: #009aff;

  --primary-foreground: #fff;




  --destructive: #ff453a;

  --destructive-foreground: #fff;

}

```




## 1. Product Overview




A modern content marketing hub designed to showcase thought leadership, educational resources, and industry insights for B2B audiences. The platform serves as a central repository for articles, case studies, guides, and whitepapers, strategically organized to guide visitors through the buyer's journey while capturing qualified leads. Built with Vite, React, Framer Motion, Tailwind CSS, and shadcn/ui components.




## 2. Key Features & Requirements




### Homepage / Content Discovery




**Requirements:**

- Feature hero section highlighting the latest or most important article

- Display curated content grid organized by relevance and recency

- Show topic cluster navigation for quick access to themed content

- Provide trending articles section




**Mock Data:**

- **Hero Featured Post:** "The Complete Guide to Revenue Operations" by Jessica Martinez, VP of Marketing

- **Topic Clusters:** Marketing Strategy (47), Sales Enablement (38), Customer Success (42), Product Management (35)




**Visual Requirements:**

- Hero section with full-width gradient background bg-gradient-to-br from-primary to-primary/80 overlaying featured image

- Hero content with large heading text-4xl md:text-5xl font-bold text-primary-foreground

- Article cards in responsive grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

- Each card with rounded corners rounded-xl, bg-card, and subtle shadow shadow-md hover:shadow-xl

- Card hover effect using Framer Motion: lift up 4px with expanded shadow




### Article Listing & Filtering




**Requirements:**

- Display all articles in paginated grid with infinite scroll

- Implement multi-faceted filtering by category, content type, and industry

- Show active filter badges that can be removed individually




**Visual Requirements:**

- Filter sidebar on desktop w-64 fixed width, collapsible drawer on mobile

- Filter groups with section headers text-sm font-semibold text-foreground mb-3

- Active filters displayed as removable pills bg-primary/20 text-primary px-3 py-1 rounded-full

- Framer Motion animation when filters are applied: fade out old results, fade in new




### Individual Article View




**Requirements:**

- Display full article content with optimized reading experience

- Show table of contents for articles over 1000 words

- Include author bio card with photo and social links

- Add inline CTA modules every 3-4 paragraphs




**Visual Requirements:**

- Centered article container max-w-3xl mx-auto px-6

- Large, readable typography text-lg leading-relaxed text-foreground

- Table of contents in sticky sidebar on desktop sticky top-24

- Author bio card with circular avatar rounded-full w-16 h-16

- Progress bar fixed to top fixed top-0 left-0 w-full h-1 bg-primary

- Inline CTA cards with distinct background bg-primary/10 p-6 rounded-xl border-2 border-primary/30




### Lead Magnets & Gated Content




**Requirements:**

- Embed downloadable resources within relevant articles

- Display gated content cards with preview and form

- Minimize form fields (email only for most offers)

- Include trust signals (download count, ratings)




**Mock Data:**

- **eBook:** "The Complete RevOps Playbook" - 75 pages, 8,450+ downloads

- **Template Bundle:** "Marketing Strategy Templates" - 12,300+ downloads




**Visual Requirements:**

- Gated content cards with distinct styling bg-card border-2 border-primary/30 p-6 rounded-xl shadow-lg

- Form with single email input border-2 border-border rounded-lg px-4 py-3

- CTA button bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold

- Success state after submission with download link




### Newsletter Signup




**Requirements:**

- Display newsletter signup prominently in multiple locations

- Show benefits of subscribing clearly

- Include social proof (subscriber count)




**Visual Requirements:**

- Hero section variant with full-width background bg-primary text-primary-foreground py-16

- Form layout: email input next to submit button on desktop, stacked on mobile

- Social proof displayed with user avatars in overlapping circles

- Success message with checkmark icon




### Exit-Intent Popup




**Requirements:**

- Detect when user's mouse moves toward browser close

- Display compelling offer to retain attention

- Provide easy close option




**Visual Requirements:**

- Modal overlay bg-foreground/50 backdrop-blur-sm

- Modal card bg-card rounded-2xl shadow-2xl p-8

- Framer Motion entrance: scale from 0.9 to 1, fade in




## 3. Animation Specifications




**Page Transitions:**

- Fade In: initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}

- Slide Up: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}




**Card Interactions:**

- Hover Lift: whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}

- Press Effect: whileTap={{ scale: 0.98 }}




**Scroll Animations:**

- Progress Bar: style={{ scaleX: scrollYProgress }}

- Fade In On Scroll: whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}




## 4. Responsive Design




**Breakpoints:**

- Mobile: < 768px - Single column, full-width cards

- Tablet: 768px - 1023px - Two-column grid

- Desktop: 1024px+ - Three-column grid, persistent sidebar

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5d9b953c-377f-4503-969f-be2e7344ba39).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
