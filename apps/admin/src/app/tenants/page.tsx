export default function TenantsPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Tenant Management</h2>
        <p className="text-muted-foreground">
          Manage tenant configurations, settings, and access controls.
        </p>
      </div>
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-12 text-center shadow-sm">
        <div className="mx-auto max-w-md space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            Tenant management features are currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
