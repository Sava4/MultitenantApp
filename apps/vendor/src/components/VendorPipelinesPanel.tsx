"use client";

import * as React from "react";
import { PipelinesTable, DEFAULT_COLUMNS, type PipelineApi } from "@acme/ui";

interface VendorPipelinesPanelProps {
  initialPipelines: PipelineApi[];
}

export function VendorPipelinesPanel({
  initialPipelines,
}: VendorPipelinesPanelProps): React.JSX.Element {
  const [pipelines, setPipelines] =
    React.useState<PipelineApi[]>(initialPipelines);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      // No tenantId param - server always uses VENDOR_TENANT_ID
      const response = await fetch("/api/pipelines");

      if (!response.ok) {
        throw new Error("Failed to fetch pipelines");
      }

      const data = await response.json();
      setPipelines(data);
    } catch (error) {
      console.error("Failed to refresh pipelines:", error);
      // Keep existing data on error
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <div className="p-6">
      <PipelinesTable
        pipelines={pipelines}
        columns={DEFAULT_COLUMNS}
        title="Pipelines"
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
