# AuditFlow AI

# AuditFlow AI

## Live Demo

Live URL: https://audit-flowai.netlify.app/

GitHub URL:
https://github.com/SaiHarshiniRakudhiti/auditflow-ai

## Screenshots
<img width="1536" height="960" alt="image" src="https://github.com/user-attachments/assets/bfac765f-e609-4ce4-8ebf-34a8fa2df2cb" />
<img width="1536" height="960" alt="Screenshot 2026-05-13 234252" src="https://github.com/user-attachments/assets/b266aaa3-729e-426d-bc47-e6a3688455bc" />
<img width="1536" height="960" alt="Screenshot 2026-05-13 232422" src="https://github.com/user-attachments/assets/27ba3442-dad8-4f6d-8b1e-e0d52d6a0a0a" />


Clean SaaS-style AI spend optimization report for startup teams.

A production-oriented Credex Round 1 build: deterministic audit math, public-safe result flow, lead capture endpoint, transactional email hook, benchmark intelligence, confidence score, and 30 audit-engine tests.

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
