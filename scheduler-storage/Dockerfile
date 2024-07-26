# Fetch the base postgres image
# Latest is awesome
FROM postgres:latest

# Copy the initialization scripts in
COPY src/sql/* /docker-entrypoint-initdb.d/

# This PoC image will NOT persist the database
# which means we need to set everything up every time
ENV POSTGRES_USER=scheduleman
ENV POSTGRES_PASSWORD=OhNoNotSecret
