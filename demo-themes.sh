#!/bin/bash

# Demo script to showcase vendor theming capabilities
# Run this to see different themed vendor deployments

echo "🎨 Building vendor app with different themes..."
echo ""

# Build once
cd "$(dirname "$0")"
VENDOR_TENANT_ID=demo pnpm build --filter vendor > /dev/null 2>&1

echo "Starting themed vendor instances:"
echo ""

# Default Blue Theme (port 3001)
echo "🔵 Blue Theme (Default) - http://localhost:3001"
echo "   Tenant: tenant-blue"
PORT=3001 VENDOR_TENANT_ID=tenant-blue \
  VENDOR_APP_TITLE="Blue Corp Portal" \
  node apps/vendor/.next/standalone/apps/vendor/server.js &
PID1=$!

# Purple Theme (port 3002)
echo "🟣 Purple Theme - http://localhost:3002"
echo "   Tenant: tenant-purple"
PORT=3002 VENDOR_TENANT_ID=tenant-purple \
  VENDOR_APP_TITLE="Purple Corp Portal" \
  VENDOR_THEME_PRIMARY="280 65% 60%" \
  VENDOR_POWERED_BY="Powered by Purple Corp" \
  node apps/vendor/.next/standalone/apps/vendor/server.js &
PID2=$!

# Orange Theme (port 3003)
echo "🟠 Orange Theme - http://localhost:3003"
echo "   Tenant: tenant-orange"
PORT=3003 VENDOR_TENANT_ID=tenant-orange \
  VENDOR_APP_TITLE="Orange Co Portal" \
  VENDOR_THEME_PRIMARY="25 95% 53%" \
  VENDOR_POWERED_BY="Powered by Orange Co" \
  node apps/vendor/.next/standalone/apps/vendor/server.js &
PID3=$!

# Green Theme (port 3004)
echo "🟢 Green Theme - http://localhost:3004"
echo "   Tenant: tenant-green"
PORT=3004 VENDOR_TENANT_ID=tenant-green \
  VENDOR_APP_TITLE="Green Inc Portal" \
  VENDOR_THEME_PRIMARY="142 71% 45%" \
  VENDOR_POWERED_BY="Powered by Green Inc" \
  node apps/vendor/.next/standalone/apps/vendor/server.js &
PID4=$!

echo ""
echo "✅ All vendor instances running!"
echo ""
echo "Press Ctrl+C to stop all instances"

# Cleanup function
cleanup() {
  echo ""
  echo "🛑 Stopping all instances..."
  kill $PID1 $PID2 $PID3 $PID4 2>/dev/null
  exit 0
}

trap cleanup INT TERM

# Wait for all background processes
wait
