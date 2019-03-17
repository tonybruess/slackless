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

# Patch
bash "${SLACKLESS_DIR}/patch.sh" $1

# Cleanup
rm -r "${TMP_DIR}"
