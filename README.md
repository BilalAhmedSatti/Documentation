# Documentation

Banking platform materials in one repo — three deployable sites.

## 1) Workflow demo (existing)

Interactive swimlane diagrams.

```bash
npm run demo
```

**Vercel:** Root URL (`/`) rewrites to `workflow-demo`.

Live: https://documentation-docs10.vercel.app/

## 2) Platform Docs v2 (Digital Banking only)

Executive documentation for **Digital Banking & Remittance only** — not sibling products. Sidebar menus, status, corrections, journeys. Does **not** modify `workflow-demo`.

```bash
npm run docs-v2
```

Open `http://localhost:5175` → lands on **Where We Stand**.

**Vercel:** same project at `/docs-v2`, or a new project with Root Directory = `docs-v2`.

## 3) Final Documentation (KYC Journey Docs J1–J19)

Standalone Pakistan EMI KYC docs — Domain Learning, SBP audit, journeys J1–J19, interactive workflows.

```bash
npx --yes serve -l 5180 final-documentation
```

**Vercel (already on this project):**  
https://documentation-docs10.vercel.app/final-documentation/

Or **Add New Project** → import **Documentation** again → Root Directory = `final-documentation`.

## Also available

```bash
npm run docs
```

Serves the older `Docs_Portal` engineering catalog on port 5174.
