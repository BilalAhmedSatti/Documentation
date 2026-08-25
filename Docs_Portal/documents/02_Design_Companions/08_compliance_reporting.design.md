# Design 08 — Compliance Reporting Service

**Runtime:** NestJS 10 / TS strict · **Squad:** Compliance & AML · **Docx:** `08_Service_Compliance_Reporting_Service.docx`

Turns Screening/Ledger data into each market's filings: goAML-aligned STRs/SARs to **FMU (PK)**, **UAE FIU**, **SAFIU (SA)** + periodic SBP/CBUAE/SAMA returns. Produces the file; portal submission may remain manual per market.

## 1. Domain

```ts
export class RegulatoryReport {           // immutable once generated; correction = linked amended report
  readonly id: ReportId; readonly tenantId: TenantId; readonly packId: PackId;
  readonly type: ReportType; readonly period: Period;
  status: 'GENERATED' | 'READY' | 'SUBMITTED' | 'ACKNOWLEDGED' | 'REJECTED';
  markSubmitted(ref: SubmissionRef, maker: PrincipalId, checker: PrincipalId): void; // maker-checker
}
export interface ReportTemplate { packId: PackId; format: 'GOAML_XML' | 'XLSX' | 'CSV'; schemaRef: string; version: number; }
```

## 2. Ports

```ts
export interface GenerateReportUC { exec(ctx: TenantContext, packId: PackId, type: ReportType, period: Period): Promise<ReportId>; }
export interface ScreeningQueryPort { casesResolved(ctx: TenantContext, p: Period): AsyncIterable<CaseRecord>; }  // → 03
export interface LedgerQueryPort    { postings(ctx: TenantContext, p: Period, f: Filter): AsyncIterable<PostingRecord>; } // → 04 (Pact)
export interface ReportRenderer     { render(t: ReportTemplate, data: ReportData): Promise<Buffer>; } // xslt/xmlbuilder2 impl in adapters/
```

## 3. Flow & data

Generate (async) → automated reconciliation check against source counts → `READY` → maker-checker `SUBMITTED`. Artifact to object storage; retained per pack.

```sql
CREATE TABLE reports (id uuid PK, tenant_id uuid, pack_id uuid, type text, period daterange,
  status text, document_ref text, checks jsonb, amended_from uuid);
CREATE TABLE report_templates (pack_id uuid, format text, schema_ref text, version int,
  PRIMARY KEY (pack_id, format, version));
```

## 4. API / Events / Tests
`POST /v1/reports` · `GET /v1/reports/{id}` · `POST /v1/reports/{id}/submitted` (maker-checker).
Publishes `compliance.report.generated|submitted.v1`; consumes `screening.case.resolved.v1`.
NFR: monthly-volume generation < 5 min async; pre-submit reconciliation check mandatory. Tests: golden-file rendering against each market's schema fixture; schema-drift test runs in pack-certification suite (§19.1); Pact consumer→03/04.
