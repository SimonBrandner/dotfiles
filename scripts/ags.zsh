#!/usr/bin/env zsh

PID=0

start_ags() {
    ags &
    PID=$!
}

stop_ags() {
    if [ $PID -ne 0 ]; then
        kill $PID
    fi
}

start_ags

while inotifywait -r -e modify,create,delete,move "/home/simon/dotfiles/config/ags"; do
    stop_ags
    start_ags
done
