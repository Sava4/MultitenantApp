"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  PipelinesTable,
  ALL_COLUMNS,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  type PipelineApi,
} from "@acme/ui";

const ALL_TENANTS_VALUE = "__all__";

interface AdminPipelinesPanelProps {
  initialPipelines: PipelineApi[];
  tenantOptions: Array<{ value: string; label: string }>;
}

export function AdminPipelinesPanel({
  initialPipelines,
  tenantOptions,
}: AdminPipelinesPanelProps): React.JSX.Element {
  const [pipelines, setPipelines] =
    React.useState<PipelineApi[]>(initialPipelines);
  const [selectedTenant, setSelectedTenant] =
    React.useState<string>(ALL_TENANTS_VALUE);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const fetchPipelines = React.useCallback(
    async (tenantId: string | null): Promise<void> => {
      setIsRefreshing(true);
      try {
        const url = tenantId
          ? `/api/pipelines?tenantId=${encodeURIComponent(tenantId)}`
          : "/api/pipelines";

        const response = await fetch(url);

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
    },
    []
  );

  const handleTenantChange = (value: string): void => {
    setSelectedTenant(value);
    const tenantId = value === ALL_TENANTS_VALUE ? null : value;
    void fetchPipelines(tenantId);
    setOpen(false);
  };

  const handleRefresh = (): void => {
    const tenantId =
      selectedTenant === ALL_TENANTS_VALUE ? null : selectedTenant;
    void fetchPipelines(tenantId);
  };

  const tenantFilter = (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Tenant:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[240px] justify-between"
          >
            {selectedTenant === ALL_TENANTS_VALUE
              ? "All tenants"
              : tenantOptions.find((opt) => opt.value === selectedTenant)
                  ?.label ?? "Select tenant..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput placeholder="Search tenant..." className="h-9" />
            <CommandList>
              <CommandEmpty>No tenant found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key={ALL_TENANTS_VALUE}
                  value={ALL_TENANTS_VALUE}
                  onSelect={() => handleTenantChange(ALL_TENANTS_VALUE)}
                >
                  All tenants
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTenant === ALL_TENANTS_VALUE
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
                {tenantOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleTenantChange(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTenant === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="p-6">
      <PipelinesTable
        pipelines={pipelines}
        columns={ALL_COLUMNS}
        title="Pipelines"
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        toolbar={tenantFilter}
      />
    </div>
  );
}
