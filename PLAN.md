# NL Speaker — Project Plan

**Client:** Next Level Speaking Services (https://nlspeaker.com/)  
**Goal:** A professional, eye-catching, trustworthy website where all content is managed from an admin dashboard.  
**Stack mirror:** Same architecture as the Remtek project (NestJS backend + Next.js frontend).

---

## 1. Tech Stack

### Backend (`nlspeaker-backend`)
| Concern | Technology |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Runtime | Node.js + Express (`@nestjs/platform-express`) |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | JWT (`@nestjs/jwt` + `passport-jwt`), bcrypt |
| Email | Resend (`resend`) — booking & contact notifications |
| File / Image storage | Cloudinary 2 |
| Validation | `class-validator` + `class-transformer` |
| Rate limiting | `@nestjs/throttler` |
| Security | `helmet` |
| Testing | Jest + Supertest |
| Port | 4001 (avoid collision with remtek on 4000) |
| Global prefix | `/v1` |

### Frontend (`nlspeaker-frontend`)
| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui (new-york style) + Radix UI |
| Icons | Lucide React |
| Animations | Framer Motion 12 |
| Toasts | Sonner |
| Themes | `next-themes` (light/dark) |

---

## 2. Site Architecture & Pages

### Public-Facing Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, stats bar, featured services, testimonials preview, CTA to book |
| `/about` | About | Speaker bio, mission/values, credentials, brand story |
| `/services` | Services | All speaking programs / service offerings |
| `/services/[slug]` | Service Detail | Full description, outcomes, ideal audience, CTA |
| `/topics` | Speaking Topics | Browse by topic area (leadership, mindset, DEI, etc.) |
| `/events` | Events | Upcoming & past speaking engagements |
| `/testimonials` | Testimonials | Full testimonials wall with filtering |
| `/media` | Media Kit / Press | Photos, logos, bios, press mentions, video clips |
| `/blog` | Blog / Resources | Articles, tips, thought leadership |
| `/blog/[slug]` | Blog Post | Single article |
| `/contact` | Contact / Book | Booking inquiry form |

### Admin Dashboard (`/admin`)

| Route | Purpose |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Dashboard — stats & recent activity |
| `/admin/services` | CRUD for speaking services / programs |
| `/admin/topics` | CRUD for speaking topics |
| `/admin/events` | CRUD for speaking events |
| `/admin/testimonials` | CRUD for testimonials (approve / feature) |
| `/admin/media` | Manage photos, logos, press logos, video clips |
| `/admin/blog` | CRUD for blog posts (rich text, publish/draft) |
| `/admin/inquiries` | View and manage booking/contact submissions |
| `/admin/settings` | Site-wide settings (hero text, tagline, social links) |

---

## 3. Backend Module Plan

```
src/
├── main.ts                         # Bootstrap — port 4001, /v1, CORS, helmet
├── app.module.ts
├── config/configuration.ts         # Typed env config
├── auth/                           # JWT auth (login, getMe)
├── admin/                          # Admin schema + seed script
├── services/                       # Speaking programs/services
├── topics/                         # Speaking topics
├── events/                         # Upcoming & past events
├── testimonials/                   # Client testimonials
├── media/                          # Press photos, logos, video clips
├── blog/                           # Blog posts (slug, rich text, published)
├── inquiries/                      # Booking / contact form submissions
├── site-settings/                  # Key-value store for site-wide content
├── upload/                         # Cloudinary image / file upload
└── common/
    ├── decorators/public.decorator.ts
    ├── filters/http-exception.filter.ts
    ├── interceptors/transform.interceptor.ts
    └── middleware/logger.middleware.ts
```

### MongoDB Schemas

**Admin**
- `email`, `passwordHash`, `name`, `role` (`super-admin` | `editor`), `lastLoginAt`

**Service (Speaking Program)**
- `slug` (unique), `title`, `shortDescription`, `fullDescription`, `outcomes[]` (strings), `idealAudience`, `duration`, `coverImage`, `order`, `isActive`

**Topic**
- `slug` (unique), `title`, `description`, `icon`, `order`, `isActive`

**Event**
- `title`, `date`, `location`, `venue`, `description`, `eventType` (`keynote` | `workshop` | `webinar` | `panel`), `registrationUrl`, `coverImage`, `isPast`, `isFeatured`, `isPublished`

**Testimonial**
- `authorName`, `authorTitle`, `authorOrganization`, `authorPhoto`, `text`, `rating` (1–5), `serviceSlug`, `videoUrl`, `isApproved`, `isFeatured`, `order`

**MediaItem**
- `type` (`photo` | `logo` | `press-logo` | `video-clip` | `document`), `title`, `url`, `thumbnailUrl`, `description`, `category`, `isPublic`

**BlogPost**
- `slug` (unique), `title`, `excerpt`, `body` (HTML/rich text), `coverImage`, `tags[]`, `author`, `publishedAt`, `isPublished`, `isFeatured`, `readingTimeMinutes`

**Inquiry (Booking / Contact)**
- `type` (`booking` | `contact`), `name`, `email`, `phone`, `organization`, `eventDate`, `eventType`, `eventLocation`, `audienceSize`, `budget`, `topics[]`, `message`, `status` (`new` | `read` | `replied` | `archived`), `ipAddress`

**SiteSetting**
- `key` (unique), `value`, `label`, `type` (`text` | `textarea` | `url` | `image`)
  - Keys: `heroHeadline`, `heroSubheadline`, `heroCtaText`, `heroImage`, `aboutSummary`, `speakerName`, `speakerTitle`, `speakerPhoto`, `linkedinUrl`, `instagramUrl`, `facebookUrl`, `youtubeUrl`, `bookingEmail`, `phone`

### API Route Summary

| Route | Auth | Purpose |
|---|---|---|
| `GET /v1/health` | Public | Keep-alive ping |
| `POST /v1/auth/login` | Public | Admin login |
| `GET /v1/auth/me` | JWT | Get current admin profile |
| `GET /v1/services` | Public | Active services |
| `GET /v1/services/:slug` | Public | Single service |
| `GET /v1/services/admin/all` | JWT | All services |
| `POST /v1/services` | JWT | Create |
| `PATCH /v1/services/:id` | JWT | Update |
| `DELETE /v1/services/:id` | JWT | Delete |
| `GET /v1/topics` | Public | Active topics |
| `GET /v1/events` | Public | Published events (optional `?past=true`) |
| `GET /v1/events/admin/all` | JWT | All events |
| `POST /v1/events` | JWT | Create |
| `PATCH /v1/events/:id` | JWT | Update |
| `DELETE /v1/events/:id` | JWT | Delete |
| `GET /v1/testimonials` | Public | Approved testimonials |
| `GET /v1/testimonials/admin/all` | JWT | All testimonials |
| `POST /v1/testimonials` | JWT | Create |
| `PATCH /v1/testimonials/:id` | JWT | Update |
| `DELETE /v1/testimonials/:id` | JWT | Delete |
| `GET /v1/media` | Public | Public media items |
| `GET /v1/media/admin/all` | JWT | All media |
| `POST /v1/media` | JWT | Create |
| `PATCH /v1/media/:id` | JWT | Update |
| `DELETE /v1/media/:id` | JWT | Delete |
| `GET /v1/blog` | Public | Published posts |
| `GET /v1/blog/:slug` | Public | Single post |
| `GET /v1/blog/admin/all` | JWT | All posts |
| `POST /v1/blog` | JWT | Create |
| `PATCH /v1/blog/:id` | JWT | Update |
| `DELETE /v1/blog/:id` | JWT | Delete |
| `POST /v1/inquiries` | Public | Submit booking/contact form |
| `GET /v1/inquiries` | JWT | List all inquiries |
| `PATCH /v1/inquiries/:id` | JWT | Update status |
| `GET /v1/site-settings` | Public | All site settings (as key→value map) |
| `PATCH /v1/site-settings` | JWT | Bulk upsert settings |
| `POST /v1/upload/image` | JWT | Upload image to Cloudinary |
| `POST /v1/upload/document` | JWT | Upload PDF/doc to Cloudinary |

---

## 4. Frontend Component Plan

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, theme, PublicShell
│   ├── page.tsx                    # Home
│   ├── about/page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── topics/page.tsx
│   ├── events/page.tsx
│   ├── testimonials/page.tsx
│   ├── media/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Sidebar + auth guard
│   │   ├── page.tsx                # Dashboard
│   │   ├── login/page.tsx
│   │   ├── services/page.tsx
│   │   ├── topics/page.tsx
│   │   ├── events/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── media/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── inquiries/page.tsx
│   │   └── settings/page.tsx
│   └── api/revalidate/route.ts     # ISR cache busting
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PublicShell.tsx
│   ├── home/
│   │   ├── Hero.tsx                # Full-viewport hero with animated headline
│   │   ├── StatsBar.tsx            # Social proof numbers (talks given, audiences, etc.)
│   │   ├── FeaturedServices.tsx
│   │   ├── TestimonialsPreview.tsx
│   │   ├── FeaturedEvents.tsx
│   │   └── BookingCta.tsx
│   ├── services/
│   ├── events/
│   ├── testimonials/
│   ├── media/
│   ├── blog/
│   ├── forms/
│   │   └── InquiryForm.tsx         # Booking / contact form
│   ├── shared/
│   │   ├── AnimatedSection.tsx
│   │   ├── SectionHeader.tsx
│   │   └── SectionSkeleton.tsx
│   └── ui/                         # shadcn/ui components
├── hooks/
│   └── useAuth.ts                  # localStorage JWT auth
├── lib/
│   ├── api.ts                      # All API calls (public + admin, ISR tags)
│   ├── constants.ts                # Site nav, metadata, enums
│   └── utils.ts                    # cn(), compressImage(), formatDate()
└── types/
    └── index.ts                    # All TypeScript interfaces
```

---

## 5. Design Direction

**Brand feel:** Professional, aspirational, authoritative — a speaker who transforms audiences.

**Color palette (suggested):**
- Primary: Deep navy `#0F172A` — authority, trust
- Accent: Gold / amber `#F59E0B` — energy, premium feel
- Surface: Off-white `#FAFAFA` / soft gray `#F1F5F9`
- Text: Near-black `#0F172A`, muted gray `#64748B`

**Typography:**
- Headlines: Playfair Display (serif) — gravitas, stage presence
- Body: Inter (sans-serif) — clean, readable

**Key UX patterns:**
- Full-viewport hero with speaker photo / video background + animated headline
- Scroll-triggered section reveals (Framer Motion)
- Sticky navigation with smooth scroll
- Testimonial carousel with photos and logos
- Event countdown timer for upcoming events
- "Book [Speaker Name]" persistent CTA button in navbar
- Mobile-first responsive design throughout

---

## 6. Caching Strategy (Frontend)

| Environment | Strategy |
|---|---|
| Development | `cache: "no-store"` on all API calls |
| Production | ISR with `revalidate: 3600` (1-hour TTL) + on-demand revalidation via `/api/revalidate` after admin writes |

Cache tags: `services`, `topics`, `events`, `testimonials`, `media`, `blog`, `site-settings`

---

## 7. Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=4001
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_NOTIFY=
FRONTEND_URL=http://localhost:3001
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4001/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_GA_MEASUREMENT_ID=
REVALIDATION_SECRET=
```

---

## 8. Deployment Plan

| Service | Platform |
|---|---|
| Backend | Render (free tier → paid as needed) |
| Frontend | Vercel |
| Database | MongoDB Atlas (free M0 cluster) |
| Images | Cloudinary (free tier) |
| Email | Resend (free tier) |

---

## 9. Build Order / Milestones

### Phase 1 — Backend Foundation
1. Scaffold NestJS project, configure MongoDB, global pipes, interceptors, guards
2. Auth module (login, getMe, JWT strategy)
3. Admin seed script (`scripts/create-admin.ts`)
4. Upload module (Cloudinary)
5. Site-settings module (key-value content store)

### Phase 2 — Backend Content Modules
6. Services module
7. Topics module
8. Events module
9. Testimonials module
10. Media module
11. Blog module
12. Inquiries module (+ Resend email notification)

### Phase 3 — Frontend Foundation
13. Scaffold Next.js project, Tailwind v4, shadcn/ui
14. Root layout, Navbar, Footer, PublicShell
15. `lib/api.ts` — all API client functions
16. `types/index.ts` — all interfaces
17. `useAuth` hook + Admin layout guard

### Phase 4 — Public Pages
18. Home page (Hero, StatsBar, FeaturedServices, TestimonialsPreview, BookingCta)
19. About page
20. Services index + detail pages
21. Topics page
22. Events page
23. Testimonials page
24. Media / Press Kit page
25. Blog index + post pages
26. Contact / Booking page

### Phase 5 — Admin Dashboard
27. Login page
28. Dashboard overview (stats)
29. Services CRUD
30. Topics CRUD
31. Events CRUD
32. Testimonials CRUD + approve/feature
33. Media CRUD
34. Blog CRUD (with rich-text editor)
35. Inquiries list + status workflow
36. Site Settings editor (hero text, speaker info, social links)

### Phase 6 — Polish & Deploy
37. SEO metadata (generateMetadata per page)
38. OG images
39. Google Analytics integration
40. Vercel deployment (frontend)
41. Render deployment (backend)
42. Domain & SSL setup

---

## 10. Key Decisions & Notes

- **Port 4001** for backend to avoid colliding with remtek-backend on 4000. Frontend dev on port 3001.
- **Site Settings module** replaces hard-coded copy — the client can update hero text, taglines, speaker bio, and social links from the admin without a code deployment.
- **Blog rich-text** — use a lightweight HTML editor in the admin (e.g. TipTap or Quill) stored as sanitised HTML in MongoDB.
- **`@Public()` decorator** pattern carried over from remtek for clean public/protected route separation.
- **Global response envelope** `{ success, data, message }` carried over from remtek for consistent API contract.
- **Image pipeline** — client-side canvas compression → base64 → backend → Cloudinary → secure URL in MongoDB (same as remtek).
- **ISR + on-demand revalidation** pattern carried over from remtek for production performance.
- **No separate admin app** — admin dashboard is embedded under `/admin` in the same Next.js app (same as remtek).
