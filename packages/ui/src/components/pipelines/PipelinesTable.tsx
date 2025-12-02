"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  type PipelineApi,
  type PipelineColumn,
  DEFAULT_COLUMNS,
  COLUMN_HEADERS,
} from "./types";
import { cn } from "../../lib/cn";

export interface PipelinesTableProps {
  /** Pipeline data to display */
  pipelines: PipelineApi[];
  /** Columns to show (defaults to all except tenantId) */
  columns?: PipelineColumn[];
  /** Optional title above the table */
  title?: string;
  /** Whether data is currently being refreshed */
  isRefreshing?: boolean;
  /** Callback when refresh is requested */
  onRefresh?: () => void;
  /** Optional toolbar content (e.g., tenant filter) */
  toolbar?: React.ReactNode;
  /** Optional className for the container */
  className?: string;
}

/**
 * Generic pipelines table component.
 * Tenant-agnostic — tenantId column is optional and controlled by parent.
 */
export function PipelinesTable({
  pipelines,
  columns = DEFAULT_COLUMNS,
  title,
  isRefreshing = false,
  onRefresh,
  toolbar,
  className,
}: PipelinesTableProps): React.JSX.Element {
  // Local state for switch toggles (no persistence, demo only)
  const [activeStates, setActiveStates] = React.useState<
    Record<string, boolean>
  >({});

  // Refresh active states from pipeline data whenever pipelines change
  React.useEffect(() => {
    const newStates: Record<string, boolean> = {};
    pipelines.forEach((p) => {
      newStates[p.pipelineId] = p.isActive;
    });
    setActiveStates(newStates);
  }, [pipelines]);

  const handleToggle = (pipelineId: string, checked: boolean): void => {
    setActiveStates((prev) => ({ ...prev, [pipelineId]: checked }));
  };

  const renderCellContent = (
    pipeline: PipelineApi,
    column: PipelineColumn
  ): React.ReactNode => {
    switch (column) {
      case "isActive":
        return (
          <Switch
            checked={activeStates[pipeline.pipelineId] ?? pipeline.isActive}
            onCheckedChange={(checked) =>
              handleToggle(pipeline.pipelineId, checked)
            }
            aria-label={`Toggle ${pipeline.pipelineName} active state`}
          />
        );
      case "tenantId":
        return (
          <span className="font-mono text-xs text-muted-foreground">
            {pipeline.tenantId}
          </span>
        );
      case "pipelineId":
        return (
          <span className="font-mono text-xs">{pipeline.pipelineId}</span>
        );
      case "name":
        return (
          <span className="font-mono text-xs text-muted-foreground">
            {pipeline.name}
          </span>
        );
      case "pipelineName":
        return <span className="font-medium">{pipeline.pipelineName}</span>;
      default:
        return pipeline[column];
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with title, toolbar, and refresh button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {title && (
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          )}
        </div>
        {toolbar && <div className="flex items-center gap-3">{toolbar}</div>}
      </div>

      {/* Table */}
      {pipelines.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">No pipelines found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{COLUMN_HEADERS[column]}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pipelines.map((pipeline) => (
                <TableRow key={pipeline.pipelineId}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {renderCellContent(pipeline, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer with count */}
      <p className="text-xs text-muted-foreground">
        {pipelines.length} pipeline{pipelines.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
