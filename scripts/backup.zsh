#!zsh

git pull

if [ -d "/etc/nixos" ] 
then
    ~/Data1/GIT/Other/dotfiles/scripts/copyNixosConfig.zsh 
fi

currentDate=$(date --iso-8601=seconds)

git add .
git commit -m  $currentDate
git push
