# Use the official lightweight Nginx alpine image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/nginx.conf

# Copy our custom configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground so the container doesn't exit
CMD ["nginx", "-g", "daemon off;"]
