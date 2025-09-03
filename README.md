# <img src="public/favicon.svg" width="24"> [Wishcraft](https://mywishcraft.app/)

Wishcraft is a lightweight wishlist app built by @ramoona. It's made for anyone who likes keeping their wishes neat, tidy, and free from ads, trackers or “smart” suggestions.

## What you can do with Wishcraft

- Sign in with your Google account
- Add and edit wishes (with links, prices, and comments), private or public
- Set your entire wishlist to public or private
- Add friends and see their wishes
- Reserve wishes from other users’ lists
- Pick your preferred language (English, German, or Russian)
- Delete your account 💔

## Tech Stack

- **Next.js** with server actions (no API endpoints besides OAuth)
- **Database**: `PostgreSQL` + `Prisma ORM`
- **Auth**: Google OAuth with custom session management
- **UI**: `Tailwind CSS` + `shadcn` components with custom styles
- **Testing**: `Jest` (unit), `Playwright` (E2E)
- **i18n**: `I18Next`

## V2 (in the works)

- Image uploads for wishes
- More language options
- More login options (other OAuth providers / email magic links)

## V3 (someday...)

- Multiple wishlists per user
