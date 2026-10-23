// Organizations in /ops. Contract: ops-api.md §7 in the wada-backend repo.

/** What an organization is (`ORG_KINDS` in wada-backend shared/src/enums.ts). Hinova chooses it; companies have no teachers. */
export const ORG_KINDS = [
  ["university", "University"],
  ["company", "Company"],
] as const;
export type OrgKind = (typeof ORG_KINDS)[number][0];
export const kindLabel = (v: string) => ORG_KINDS.find(([id]) => id === v)?.[1] ?? v;

/** One row of `ops_orgs()`. */
export type OrgRow = {
  org_id: string;
  name: string;
  kind: OrgKind;
  created_at: string;
  admins: string[];
  teachers: number;
  students: number;
  classes: number;
};
