#!/usr/bin/env ash

# wait for the runner to trigger us to start, so it can start its timer
echo "ready" | ncat --listen --source-port 1234

# run
python3 mount/index.py
