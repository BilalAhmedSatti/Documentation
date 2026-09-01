# Documentation

Banking platform materials in one repo — two deployable sites.

## 1) Workflow demo (existing)

Interactive swimlane diagrams.

```bash
npm run demo
```

**Vercel:** Root Directory = `workflow-demo` (or repo root with the existing root `vercel.json` rewrite).

## 2) Platform Docs v2 (EMI / e-money & remittance)

Executive documentation for **EMI / e-money issuance, safeguarding, agent cash-in/out, and remittance** — not sibling products. Includes a full **EMI & e-money** sidebar section plus journey workflows (cash-in, cash-out, agent float, reversal/refund).

```bash
npm run docs-v2
```

Open `http://localhost:5175` → lands on **Where We Stand**.

**Vercel (new project):**

1. Add New → Project → same GitHub repo  
2. Framework: **Other**  
3. Root Directory: **`docs-v2`**  
4. Build / output: leave empty  
5. Deploy → new URL (e.g. `docs-v2-xxx.vercel.app`)

## Also available

```bash
npm run docs
```

Serves the older `Docs_Portal` engineering catalog on port 5174.
