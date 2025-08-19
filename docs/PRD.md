## Ravenkart PRD

### Introduction
**Purpose**: To allow individuals to create and share digital business cards using QR and NFC technology.

**Why**: Traditional paper business cards are outdated, hard to update, and not interactive. Ravenkart solves this by offering a modern, mobile-first, shareable digital card.

**Features (one sentence)**: elegant UI, animations, multilingual support, Supabase backend, subscription plans, admin dashboards.

**Vision**: To become the most user-friendly, modern digital identity solution that replaces paper cards completely.

**Default Language**: The platform’s default language is **Turkish**. If no other preference is detected, the UI always falls back to Turkish. Users can switch to other supported languages from the Navbar.

### Login & Registration
- Users can create accounts with email + password.
- Basic login and registration flow must be implemented.
- Email verification should be included in the flow.
- "Forgot Password" option with reset link via email.
- Keep initial version simple: only email and password.
- Later stages can add social login options.

### Home / Landing Page
- A modern, elegant landing page.
- Explains what Ravenkart is and why it’s superior to paper business cards.
- Animated gradient buttons and small animations for a modern feel.
- Two main buttons:
  1. "Edit Digital Card"
  2. "My Digital Card"
- Statistics panel showing how many times the QR code was scanned.

### Navbar
- Transparent, glassmorphism-inspired design.
- Contains: Home, Language Selector, Logout.
- Always visible at the top of the app.

### Digital Business Card Editor
- Users can upload a profile photo (support carousel with multiple images).
- Photo can be cropped and scaled.
- Users can upload a company logo.
- Fields: Full Name, Title, Company, Phone, Email, Website.
- Save button to export user info as `.vcf` file.
- Button to save card as an icon on device home screen. (Icon = first profile photo, Name = Full Name).
- Social Media Section: Users can add usernames for LinkedIn, Twitter (X), Instagram, TikTok, YouTube, Facebook, Snapchat, Telegram, Pinterest, WhatsApp.
- Each platform displayed with official icons.
- Toggle visibility on/off for each platform.
- Two QR code modes:
  1. Full Social Card
  2. Minimal Card (only selected fields)
- Generated QR codes are shown in a carousel, visitors can scan whichever they want.
- Visitors see read-only version of the card.
- Footer: "Powered by Ravenkart" with a link to our homepage.

### Projects & Products
- Users can add projects or products to display in their card.
- Each entry includes: photo + link.
- If no link is provided → a short description page with multiple images can be shown.
- Users can upload short info + photos for this page.

### Settings
- Light Mode / Dark Mode toggle.
- Gradient Ribbon: users can configure ribbon below their profile picture.
- Options: gradient style, start & end colors, preview.

### My Digital Card
- Fullscreen responsive layout for mobile.
- At the top: square profile photo (full width, no border).
- Below: 30px gradient ribbon.
- Then: Full Name, Title, Company.
- Below: Social Media icons.
- QR codes in a carousel.
- At the bottom: Projects/Products section.

### Card Scanner & Gallery
- Users can scan other cards via QR.
- Scanned cards stored in a gallery with folder organization.
- Cards can be cropped and notes can be added.
- Stored cards can be exported as PDF (including notes).
- This page is available only to admins and paid plan users.
- Modern, minimal design.

