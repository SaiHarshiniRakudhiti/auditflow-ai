# AuditFlow AI

Clean SaaS-style AI spend optimization report for startup teams.

A production-oriented Credex Round 1 build: deterministic audit math, public-safe result flow, lead capture endpoint, transactional email hook, benchmark intelligence, confidence score, and 30 audit-engine tests.

## Screenshots / video
Add 3 real screenshots and a 30-second Loom after deployment. Do not leave this empty for final submission.

## Quick start
```bash
npm install
cp .env.example .env.local
npm run dev
npm test
```

## Production setup
1. Create Supabase table using `supabase/schema.sql`.
2. Add Supabase, Resend, Anthropic, and app URL env vars.
3. Deploy on Cloudflare Pages or Netlify.
4. Add real screenshots and deployed URL here.

## Decisions
1. Next.js + TypeScript for typed product flow, API routes, metadata, and deploy speed.
2. Deterministic audit engine for math; AI is used only for summary copy/fallback.
3. Email gate appears after value is shown to match the assignment and improve trust.
4. Public reports must strip company/email but keep tools and savings to support virality.
5. Benchmark and confidence scores make the report feel finance-literate, not like a generic calculator.

## Live URL
TODO: paste deployed Cloudflare/Netlify URL.
