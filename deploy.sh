#!/bin/bash
set -e

SERVER="root@45.90.237.246"
REMOTE_DIR="/opt/cubepath-assistant"

echo "==> Syncing project..."
rsync -avz --exclude node_modules --exclude .git --exclude '*.db' --exclude '*.db-*' --exclude scratch-files \
  ./ "$SERVER:$REMOTE_DIR/"

echo "==> Installing dependencies and starting services..."
ssh "$SERVER" << 'EOF'
  # Install Bun if not present
  if ! command -v bun &>/dev/null; then
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
    export PATH="$HOME/.bun/bin:$PATH"
  fi

  cd /opt/cubepath-assistant
  bun install

  # Kill existing processes
  pkill -f "bun.*launcher-api" || true
  pkill -f "bun.*vite" || true
  sleep 1

  # Start launcher-api
  export CUBEPATH_API_KEY="${CUBEPATH_API_KEY:-}"
  nohup bun run launcher-api/index.ts > /tmp/launcher-api.log 2>&1 &

  # Build and serve frontend
  cd launcher-web
  bun run build
  cd ..

  # Serve static files with a simple Bun server
  nohup bun -e "Bun.serve({port:3000,fetch(req){const url=new URL(req.url);let path='launcher-web/dist'+url.pathname;if(!path.includes('.')){path='launcher-web/dist/index.html'}return new Response(Bun.file(path))}})" > /tmp/launcher-web.log 2>&1 &

  echo "==> Services started!"
  echo "    API: http://0.0.0.0:3001"
  echo "    Web: http://0.0.0.0:3000"
EOF

echo "==> Deploy complete! http://45.90.237.246:3000"
