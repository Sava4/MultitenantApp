import { getPipelines } from "@/lib/api";
import { VendorPipelinesPanel } from "@/components/VendorPipelinesPanel";

export default async function HomePage(): Promise<React.JSX.Element> {
  // Fetch pipelines scoped to vendor's tenant (enforced server-side)
  const pipelines = await getPipelines();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Your Pipelines</h2>
        <p className="text-muted-foreground">
          Monitor and manage your pipeline executions in real-time.
        </p>
      </div>
      <div className="rounded-lg border border-primary/20 bg-card shadow-sm">
        <VendorPipelinesPanel initialPipelines={pipelines} />
      </div>
    </div>
  );
}
