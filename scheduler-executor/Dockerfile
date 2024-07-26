# Fetch the base node image
# Node 20 upwards should work (should)
FROM node:22-alpine

# Set up the code
# We need the common-sdk "module" since it's not a real module (file modules are a pain)
WORKDIR /scheduleman
RUN mkdir scheduler-common-sdk
COPY scheduler-common-sdk scheduler-common-sdk
RUN mkdir scheduler-executor
COPY scheduler-executor scheduler-executor

# We assume everything is already built and ready to roll
WORKDIR /scheduleman/scheduler-executor

# Set up the needed DB vars
ENV PGHOST=storage
ENV PGPORT=5432
ENV PGUSER=scheduleman
ENV PGPASSWORD=OhNoNotSecret
ENV PGDATABASE=scheduleman

# Kick the app
CMD [ "node", "src/main.js" ]
