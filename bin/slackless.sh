#!/usr/bin/env bash
TMP_DIR=`mktemp -d -t slackless`
SLACKLESS_DIR="${TMP_DIR}"
RELEASE_BUNDLE="${TMP_DIR}/slackless.tar.gz"

# Get latest release
RELEASE_URL=`curl -s https://api.github.com/repos/tonybruess/slackless/releases/latest | grep tarball_url | head -n 1 | cut -d '"' -f 4`

echo "slackless: downloading release ${RELEASE_URL}..."
wget -q -O "${RELEASE_BUNDLE}" "${RELEASE_URL}"
if [ $? -ne 0 ];
then
  echo "slackless: chould not download latest release."
  exit -1
fi

# Unzip
echo "slackless: extracting..."
tar -xzf "${RELEASE_BUNDLE}" -C "${SLACKLESS_DIR}" --strip-components 1

# Install asar locally
npm --prefix ${SLACKLESS_DIR} --silent install asar
ASAR_CMD="${SLACKLESS_DIR}/node_modules/.bin/asar"

# Patch
ASAR_CMD="${ASAR_CMD}" bash "${SLACKLESS_DIR}/bin/patch.sh" $1

# Cleanup
rm -r "${TMP_DIR}"
