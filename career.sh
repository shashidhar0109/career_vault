#!/bin/bash
# Career Cockpit CLI Controller
# Usage:
#   ./career.sh start   - Starts the application locally in the background
#   ./career.sh stop    - Stops the running application
#   ./career.sh delete  - Completely uninstalls and deletes the app from this system

PID_FILE=".app.pid"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Career Cockpit is already running (PID $(cat "$PID_FILE")) on http://localhost:3000"
      exit 0
    fi
    echo "Starting Career Cockpit on http://localhost:3000..."
    if [ ! -d "node_modules" ]; then
      echo "Installing dependencies first (one-time setup)..."
      npm install
    fi
    npm run dev > .app.log 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started successfully (PID $!)."
    echo "Access your app at: http://localhost:3000"
    echo "To stop anytime, run: ./career.sh stop"
    ;;

  stop)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        rm -f "$PID_FILE"
        echo "Career Cockpit (PID $PID) has been stopped."
      else
        rm -f "$PID_FILE"
        echo "Process $PID was not running. Cleared PID file."
      fi
    else
      # Check if port 3000 is occupied by vite/node
      PORT_PID=$(lsof -ti:3000 2>/dev/null)
      if [ -n "$PORT_PID" ]; then
        kill "$PORT_PID" 2>/dev/null
        echo "Stopped server running on port 3000."
      else
        echo "Career Cockpit is not currently running."
      fi
    fi
    ;;

  delete)
    echo "WARNING: You are about to completely remove this application from your system."
    read -p "Are you sure you want to delete this folder? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      # Stop if running
      if [ -f "$PID_FILE" ]; then
        kill "$(cat "$PID_FILE")" 2>/dev/null
        rm -f "$PID_FILE"
      fi
      CURRENT_DIR=$(pwd)
      PARENT_DIR=$(dirname "$CURRENT_DIR")
      FOLDER_NAME=$(basename "$CURRENT_DIR")
      echo "Deleting $CURRENT_DIR..."
      cd "$PARENT_DIR" && rm -rf "$FOLDER_NAME"
      echo "Application deleted completely."
      exit 0
    else
      echo "Delete operation canceled."
    fi
    ;;

  *)
    echo "Career Cockpit CLI Runner"
    echo "------------------------"
    echo "Commands:"
    echo "  ./career.sh start   : Run app in background at http://localhost:3000"
    echo "  ./career.sh stop    : Stop the running application"
    echo "  ./career.sh delete  : Completely delete/remove the application from this machine"
    exit 1
    ;;
esac
