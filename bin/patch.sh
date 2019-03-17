#!/usr/bin/env bash
SLACKLESS_DIR=$(cd `dirname $(dirname $0)` && pwd)

SLACK_DIR="/Applications/Slack.app/"
CONTENTS_DIR="${SLACK_DIR}/Contents/"
RESOURCES_DIR="${CONTENTS_DIR}/Resources/"

# Make sure Slack is installed.
if [ ! -d ${SLACK_DIR} ]; then
   echo "slackless: could not find Slack.app"
   exit -1
else
  SLACK_VERSION=`defaults read ${CONTENTS_DIR}/Info.plist CFBundleShortVersionString`
  echo "slackless: found Slack version ${SLACK_VERSION}"
fi

# Make sure we have asar.
ASAR_CMD="${ASAR_CMD:-asar}"
if [[ ! -x `command -v ${ASAR_CMD}` ]]; then
  ASAR_CMD="${SLACKLESS_DIR}/node_modules/.bin/asar"
fi

if [[ ! -x `command -v ${ASAR_CMD}` ]]; then
  echo "slackless: installing asar..."
  npm --prefix ${SLACKLESS_DIR} --silent install asar
fi

ASAR="${RESOURCES_DIR}/app.asar"
ASAR_BACKUP="${ASAR}.backup"
ASAR_UNPACKED="${ASAR}.unpacked"

# Use or create a backup
if [ ! -f "${ASAR_BACKUP}" ]; then
  cp "${ASAR}" "${ASAR_BACKUP}"
else
  cp "${ASAR_BACKUP}" "${ASAR}"
fi

ASAR_MD5=`md5 -q ${ASAR_BACKUP}`
PATCH="${SLACKLESS_DIR}/patches/${ASAR_MD5}.patch"

# Find correct patch.
if [ ! -f "${PATCH}" ]; then
  echo "slackless: no patch file for your version of Slack.app asar (md5: ${ASAR_MD5})."
  exit -1
else
  echo "slackless: found patch ${PATCH}"
fi

# Configure patch. TODO: broken
URL="https://tonybruess.github.io/slackless/slackless.js"
if [[ "$1" != "" ]]; then
  URL="$1"
fi

# Quit Slack
echo "slackless: quitting Slack..."
osascript <<EOF
repeat until app "Slack" is not running
    quit app "Slack"
    delay 1
end repeat
EOF

# Extract asar.
echo "slackless: extracting asar..."
cd "${RESOURCES}" && "${ASAR_CMD}" extract "${ASAR}" "${ASAR_UNPACKED}"

# Patch.
cd "${ASAR_UNPACKED}" && bash "${PATCH}" "${URL}"
if [ $? -ne 0 ]; then
  echo "slackless: application of ${ASAR_MD5}.patch failed."
  exit -1
fi

# Pack asar.
echo "slackless: packing asar..."
cd "${RESOURCES}" && "${ASAR_CMD}" pack "${ASAR_UNPACKED}" "${ASAR}"

# Disable gatekeeper
echo "slackless: temporarily disabling gatekeeper... please enter your password if prompted"
sudo spctl --master-disable

# Open Slack
echo "slackless: opening Slack... please click 'Open' when prompted"
open "${SLACK_DIR}"

# Enable gatekeeper
echo "slackless: re-enabling gatekeeper..."
sudo spctl --master-enable

echo "slackless: done"
exit 0
