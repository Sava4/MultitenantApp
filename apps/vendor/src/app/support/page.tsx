export default function SupportPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Support</h2>
        <p className="text-muted-foreground">
          Get help with your pipelines, access documentation, and contact support.
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
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            Support resources are currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
