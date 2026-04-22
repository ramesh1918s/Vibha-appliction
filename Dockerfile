# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer-cache friendly)
COPY package.json ./

# Install dependencies (no devDependency pruning needed – react-scripts is in deps)
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY public/ ./public/
COPY src/    ./src/
COPY tsconfig.json ./

# Build the production bundle
ENV NODE_ENV=production
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Serve with Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx config – handles React Router (client-side routing)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Serve static assets with long-term cache\n\
    location /static/ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
\n\
    # All other routes → React app (SPA fallback)\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Security headers\n\
    add_header X-Frame-Options "SAMEORIGIN";\n\
    add_header X-Content-Type-Options "nosniff";\n\
    add_header X-XSS-Protection "1; mode=block";\n\
    add_header Referrer-Policy "strict-origin-when-cross-origin";\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

