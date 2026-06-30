$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

npm install
npm run build
npm prune --omit=dev
ln -s /mnt/volume_tor1_01/bdi2-results results

$ACTIVATE_RELEASE()