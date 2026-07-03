# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from the base stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/next.config.js ./next.config.js
COPY --from=base /app/app ./app
COPY --from=base /app/components ./components
COPY --from=base /app/lib ./lib
COPY --from=base /app/services ./services
COPY --from=base /app/store ./store
COPY --from=base /app/tailwind.config.js ./tailwind.config.js
COPY --from=base /app/postcss.config.js ./postcss.config.js
COPY --from=base /app/submission.json ./submission.json
COPY --from=base /app/.eslintrc.json ./.eslintrc.json
COPY --from=base /app/app/globals.css ./app/globals.css
COPY --from=base /app/hooks ./hooks

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]
