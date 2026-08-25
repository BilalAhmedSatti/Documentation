# Design 27 — Repository, Branching & Development Readiness

**Platform:** GitHub (repos, Actions, Environments, Issues, Projects) · **Owning squad:** Platform / Enablement · **Status:** ready to execute · **Docx:** `27_Repository_Branching_and_Development_Readiness.docx`

The bridge from blueprints (00–26) to actual development: repo topology, branch model, environment promotion, CI checks, tooling, and the day-one runbook.

## 1. Repos (8)

| Repo | Contents | Release unit |
|---|---|---|
| `platform-docs` | blueprints, design.md set, ADRs, RFCs | merge = published |
| `platform-packages` | `@platform/{money,tsconfig,telemetry,persistence,oidc,pact-fixtures}` | npm semver via Changesets |
| `platform-adapters` | the 8 shared adapters (incl. 24/25/26) — one workspace, independent deployables | `adapter-tax-v1.2.0` style tags |
| `banking-app` | Ledger, Payments, Wallets, Cards, Pricing, Recon, BFFs | `banking-vX.Y.Z` |
| `takaful-app` | Policy Admin, Underwriting, Claims, pool, BFF | `takaful-vX.Y.Z` |
| `platform-infra` | Terraform + ArgoCD GitOps overlays | apply/sync by PR |
| `service-template-ts` / `-jvm` | golden paths (Doc 01) | GitHub template repos |

Conventions everywhere: `main` default; CODEOWNERS; Conventional-Commit PR titles (squash merge); contracts in `/contracts` (spec-first PRs); issue forms, no blank issues.

## 2. Branch model (GitHub Flow + tags)

```mermaid
flowchart LR
  F[feature/1234-slug<br/>fix/ chore/ spike/] --> PR[PR: checks + review<br/>squash merge]
  PR --> M[main — protected,<br/>always releasable]
  M -->|every merge| DEV[(develop env)]
  M -->|cut| RC[tag vX.Y.Z-rc.N] --> STG[(staging env<br/>1 approver)]
  STG -->|sign-off| REL[tag vX.Y.Z] --> P1[(prod-pk)] --> P2[(prod-ae)] --> P3[(prod-sa<br/>in-Kingdom, +compliance approver)]
  P3 -.prod defect.-> HF[hotfix/1301 from tag] -.PR + vX.Y.Z+1.-> PR
```

No long-lived `develop`/`staging` branches — environments are **artifact promotion** (same signed image, no rebuild), approvals via GitHub Environments (`develop`, `staging`, `production-pk/ae/sa`; sa requires the KSA compliance owner). Rollback = redeploy previous tag; migrations expand–migrate–contract. Shared adapters version independently (vN/vN+1 deprecation windows).

Branch protection on `main`: PR required · approvals (1 app repos, 2 platform repos) · CODEOWNERS review · required checks green + up-to-date · linear history · no force push · signed commits · release tags restricted to release-managers team.

## 3. Required checks

TS services: `lint-and-test` (ESLint+money rule, tsc, unit) · `boundaries` (dependency-cruiser) · `security` (CodeQL, dep review, image scan) · `component` (Testcontainers) · `contracts` (**Pact — both apps for platform-adapters**) · `build` (image+cosign+SBOM). JVM (Ledger/Pricing): ArchUnit + jqwik in place of TS gates. infra: fmt/validate/plan-on-PR/policy. Dependabot on day one.

## 4. Hosting & CD

GHCR registry (cosign-signed; `sa` pulls via in-Kingdom mirror) · ArgoCD per cluster watching `platform-infra/gitops/<env>` — deploy = image-tag bump PR; git log is the audit trail · Terraform applied by Actions with **cloud OIDC federation** (no long-lived keys) · runtime secrets in Vault (GitHub Env secrets = pipelines only) · Pact Broker with `can-i-deploy` gating promotion · clusters: 1 develop, 1 staging, 3 production (pk/ae/sa; sa in-Kingdom from first apply).

## 5. Issues & planning

Issues on the owning repo; org-level **Platform Delivery** Project (Backlog→Ready→In Progress→In Review→Done; fields App/Squad/Phase/Priority/Release). Labels: `type/* app/* squad/* priority/* phase/{A..D}`. Milestones = phases + releases. PRs `Closes #NNN`.

## 6. Dev tooling

git+gh (signed commits) · Volta-pinned Node 22 · npm workspaces + Changesets · Temurin 21 + Gradle wrapper (Ledger/Pricing only) · Docker/colima + compose profiles · kubectl/helm/k9s (read-only; write via GitOps) · Terraform 1.8 (infra contributors) · husky+lint-staged+commitlint · VS Code / IntelliJ shared settings · `platform-cli` scaffolder.

## 7. Day-one runbook (order matters)
1 org+teams+2FA → 2 `platform-docs` (+ADR-0001 = this strategy) → 3 both templates (scaffold passes checks unmodified) → 4 `platform-packages` v0.1.0 → 5 infra: develop cluster + ArgoCD + OIDC (hello-service deploys) → 6 Environments+protections+Pact broker (full promote drill to prod-pk) → 7 create the three code repos; open Phase-A epics → 8 staging, then production clusters per phase.

**Prove the pipeline with the walking skeleton** before anything valuable ships on it.
