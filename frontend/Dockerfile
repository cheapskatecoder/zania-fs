FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Clean install dependencies
RUN npm ci

# Copy application code
COPY . .

# Make sure all dependencies are installed
RUN npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities || npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Set the correct permissions
RUN chmod -R 755 /app/node_modules

EXPOSE 3000

CMD ["npm", "start"] 