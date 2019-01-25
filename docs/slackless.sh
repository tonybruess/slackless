# Get latest release.
RELEASE_URL=`curl -s https://api.github.com/repos/tonybruess/slackless/releases/latest | grep tarball_url | head -n 1 | cut -d '"' -f 4`
RELEASE_BUNDLE="slackless.tar.gz"

echo "slackless: downloading release ${RELEASE_URL}..."
wget -q -O "${RELEASE_BUNDLE}" "${RELEASE_URL}"
if [ $? -ne 0 ];
then
  echo "slackless: chould not download latest release."
  exit -1
fi

# Unzip.
echo "slackless: extracting release ${RELEASE_BUNDLE}..."
SLACKLESS_DIR="slackless"
mkdir -p ${SLACKLESS_DIR}
tar -xzf "${RELEASE_BUNDLE}" -C "${SLACKLESS_DIR}" --strip-components 1

# Patch.
bash "${SLACKLESS_DIR}/bin/patch.sh" $1
