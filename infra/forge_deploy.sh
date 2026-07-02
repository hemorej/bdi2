$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

/home/forge/.local/share/pnpm/bin/pnpm install --frozen-lockfile
/home/forge/.local/share/pnpm/bin/pnpm run build
/home/forge/.local/share/pnpm/bin/pnpm prune --prod

ln -s /mnt/volume-tor1-01/bdi2-results results
ln -s /mnt/volume-tor1-01/bdi2fonts public/fonts

$ACTIVATE_RELEASE()
