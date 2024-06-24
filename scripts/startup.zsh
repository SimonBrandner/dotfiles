#!/usr/bin/env zsh

# Services
swayidle -w -d &>> /tmp/swayidle.log &
/home/simon/dotfiles/scripts/kde_polkit.zsh &
wayland-pipewire-idle-inhibit &
kdeconnect-indicator &

# Shell
/home/simon/dotfiles/scripts/ags.zsh &>> /tmp/ags.log &
sleep 1.5

# Background apps
QT_QPA_PLATFORM=xcb megasync &
copyq --start-server &

# Social apps
alacritty &
TERMINAL_PID=$!
sleep 1
hyprctl dispatch hy3:makegroup tab

element-desktop &
spotify &
webcord &
ferdium &

# Browser
/home/simon/dotfiles/scripts/chrome.zsh &

sleep 7.5 && kill -9 $TERMINAL_PID &
