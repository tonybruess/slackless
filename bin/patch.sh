#!/usr/bin/env bash
SLACKLESS_DIR=$(cd `dirname $(dirname $0)` && pwd)

# Make sure Slack is installed.
echo "slackless: finding Slack.app..."
SLACK_DIR="/Applications/Slack.app/"
if [ ! -d ${SLACK_DIR} ]; then
   echo "slackless: could not find Slack.app"
   exit -1
fi

# Find correct patch.
echo "slackless: finding patch..."
RESOURCES="/Applications/Slack.app/Contents/Resources/"
ASAR="/Applications/Slack.app/Contents/Resources/app.asar"
ASAR_MD5=`md5 -q ${ASAR}`
PATCH="${SLACKLESS_DIR}/patches/${ASAR_MD5}.patch"
if [ ! -f "${PATCH}" ]; then
  echo "slackless: no patch file for your version of Slack.app asar (md5: ${ASAR_MD5})."
  exit -1
fi
echo "slackless: found path ${PATCH}"

# Configure patch.
URL="https://tonybruess.github.io/slackless/slackless.js"
if [[ "$1" != "" ]]; then
  URL="$1"
fi

# Extract asar.
echo "slackless: extracting asar..."
cd "${RESOURCES}" && asar extract "${ASAR}" "${ASAR}.unpacked"

# Patch.
cd "${ASAR}.unpacked" && bash "${PATCH}" "${URL}"
if [ $? -ne 0 ]; then
  echo "slackless: application of ${ASAR_MD5}.patch failed."
  exit -1
fi

# Pack asar.
echo "slackless: packing asar..."
cd "${RESOURCES}" && asar pack "${ASAR}.unpacked" "${ASAR}"

echo "slackless: done"
exit 0
