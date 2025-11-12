FROM denoland/deno:alpine-2.5.6

WORKDIR /app

# Expose backend server port
EXPOSE 8000

# Install dependencies and start development server
CMD [ "deno", "run", "dev" ]
