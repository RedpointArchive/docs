#!/bin/bash

set -e
set -x

echo "## Deploying with rsync to buckets ..."

GSUTIL=gsutil
if [ -e "/c/Users/June/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gsutil.cmd" ]; then
  GSUTIL="/c/Users/June/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gsutil.cmd"
fi
if [ -e "/c/Users/jrhod/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gsutil.cmd" ]; then
  GSUTIL="/c/Users/jrhod/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gsutil.cmd"
fi
"$GSUTIL" -m rsync -d -r -c dist-docs gs://support.redpoint.games