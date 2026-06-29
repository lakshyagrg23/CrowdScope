# We use the 'slim' version of Node 20 (LTS). 
# 'LTS' (Long Term Support) ensures stability and security updates.
# 'slim' means it strips out tools like python and compilers, keeping the image small and secure.
FROM node:20-slim

# Install OpenSSL, which is required by Prisma engines.
# apt-get is the package manager for Debian-based images (like node:slim).
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and generate the Prisma Client.
# We do this BEFORE copying the rest of the code because the schema rarely changes
# compared to the application code, so this layer can be cached!
COPY prisma ./prisma/
RUN npx prisma generate

# Now copy the rest of the application code
COPY . .

# The backend runs on port 5000 according to server.js
EXPOSE 5000

# Command to start the server
CMD ["npm", "run", "start"]
