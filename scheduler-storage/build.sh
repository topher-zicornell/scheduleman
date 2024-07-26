#!/usr/bin/env bash

function spewUsage() {
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  network"
  echo "    Set up the shared network to allow the components to talk to the storage layer."
  echo "  package"
  echo "    Build the docker image."
  echo "  run"
  echo "    Start the docker container."
  echo ""
}

case "$1" in
  "network")
    docker network create scheduler_net
    ;;
  "package")
    docker build . -t scheduler-storage:demo
    docker create -p 5432:5432 --name storage --network scheduler_net scheduler-storage:demo
    ;;
  "run")
    docker start storage
    ;;
  "")
    spewUsage
    ;;
  *)
    echo "Unknown command: $1"
    echo ""
    spewUsage
esac
