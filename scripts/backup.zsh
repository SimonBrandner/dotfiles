#!zsh

git pull

currentDate=$(date --iso-8601=seconds)

git add .
git commit -m $currentDate
git push
