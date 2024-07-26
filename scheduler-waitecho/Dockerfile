# Fetch the base node image
# Node 20 upwards should work (should)
FROM node:22-alpine

# Set up the code
# We need the common-sdk "module" since it's not a real module (file modules are a pain)
WORKDIR /scheduleman
RUN mkdir scheduler-common-sdk
COPY scheduler-common-sdk scheduler-common-sdk
RUN mkdir scheduler-waitecho
COPY scheduler-waitecho scheduler-waitecho

# We assume everything is already built and ready to roll
WORKDIR /scheduleman/scheduler-waitecho

# Kick the app
ENV PORT=5003
CMD [ "node", "src/main.js" ]

# Let the outside world in
EXPOSE 5003