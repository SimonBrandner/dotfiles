#!zsh

if [ -d "/etc/nixos" ] 
then
    ./copyNixosConfig.zsh 
fi

currentDate=$(date --iso-8601=seconds)

git add .
git commit -m  $currentDate
git push
