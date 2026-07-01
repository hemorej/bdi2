$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

npm install 
npm run build
npm prune --omit=dev

ln -s /mnt/volume-tor1-01/bdi2-results results
ln -s /mnt/volume-tor1-01/bdi2fonts public/fonts

$ACTIVATE_RELEASE()
