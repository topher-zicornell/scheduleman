# Fetch the base node image
# Node 20 upwards should work
FROM node:22-alpine

# Set up the code
# We need the common-sdk "module" since it's not a real module (file modules are a pain)
WORKDIR /scheduleman
RUN mkdir scheduler-common-sdk
COPY scheduler-common-sdk scheduler-common-sdk
RUN mkdir scheduler-ui
COPY scheduler-ui scheduler-ui

# We assume everything is already built and ready to roll
WORKDIR /scheduleman/scheduler-ui

# Kick the app
CMD npm run start

# Let the outside world in
EXPOSE 3000