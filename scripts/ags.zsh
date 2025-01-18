#!/usr/bin/env zsh

ags run &

while inotifywait -r -e modify,create,delete,move "/home/simon/dotfiles/config/ags"; do
	ags quit
	sleep 0.25
	ags run &
done
