#!/bin/bash
# Abort on Error
set -e

export PING_SLEEP=30s
export WORKDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export BUILD_OUTPUT=$WORKDIR/build.out
export TERM=dumb
export NODE_DISABLE_COLORS=true

npm config set color false

touch $BUILD_OUTPUT

dump_output() {
   echo Tailing the last 500 lines of output:
   tail -500 $BUILD_OUTPUT
   truncate -s 0 $BUILD_OUTPUT
}
error_handler() {
  echo ERROR: An error was encountered with the build.
  dump_output
  exit 1
}
# If an error occurs, run our error handler to output a tail of the build
#trap 'error_handler' ERR

# Set up a repeating loop to send some output to Travis.

#bash -c "while true; do echo \$(date) - building ...; sleep $PING_SLEEP; done" &
#PING_LOOP_PID=$!

echo "Starting frontend..."
NODE_OPTIONS=--max_old_space_size=7000 npm run start:aot & #>> $BUILD_OUTPUT 2>&1 &
while ! curl --output /dev/null --silent -r 0-0 --fail "http://localhost:7000/ui"; do
  sleep 3
done

echo "Starting backend..."
./travis-start-engine.sh #>> $BUILD_OUTPUT 2>&1
#dump_output

echo "Running E2E tests..."
npm run cypress:run --  --record --key b43d988f-5145-4a2b-9df3-ce3b1607f203 #>> $BUILD_OUTPUT 2>&1
#dump_output

echo "Stopping frontend..."
pkill npm

echo "Stopping backend..."
./travis-stop-engine.sh #>> $BUILD_OUTPUT 2>&1
#dump_output

# nicely terminate the ping output loop
#kill $PING_LOOP_PID

echo "Running production build..."
LUMEER_ENV=production SKIP_SENTRY_UPLOAD=true mvn clean install

echo "Printing bundle sizes..."
npm run bundlesize
