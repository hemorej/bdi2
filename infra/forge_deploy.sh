$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

npm install --omit=dev
ln -s /mnt/volume_tor1_01/bdi2-results results

$ACTIVATE_RELEASE()