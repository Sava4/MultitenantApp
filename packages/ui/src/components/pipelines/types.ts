/**
 * Pipeline data shape from the upstream API.
 */
export interface PipelineApi {
  /** Tenant identifier */
  tenantId: string;
  /** Unique pipeline identifier */
  pipelineId: string;
  /** Human-readable display name */
  pipelineName: string;
  /** Code/system name */
  name: string;
  /** Whether the pipeline is currently active */
  isActive: boolean;
}

/**
 * Column keys available for the PipelinesTable.
 */
export type PipelineColumn =
  | "tenantId"
  | "pipelineId"
  | "pipelineName"
  | "name"
  | "isActive";

/**
 * Default columns to display (excludes tenantId for vendor app).
 */
export const DEFAULT_COLUMNS: PipelineColumn[] = [
  "pipelineId",
  "pipelineName",
  "name",
  "isActive",
];

/**
 * All columns including tenantId (for admin app).
 */
export const ALL_COLUMNS: PipelineColumn[] = [
  "tenantId",
  "pipelineId",
  "pipelineName",
  "name",
  "isActive",
];

/**
 * Human-readable column headers.
 */
export const COLUMN_HEADERS: Record<PipelineColumn, string> = {
  tenantId: "Tenant ID",
  pipelineId: "Pipeline ID",
  pipelineName: "Pipeline Name",
  name: "Code Name",
  isActive: "Active",
};
