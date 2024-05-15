#!/usr/bin/env zsh

# Services
swayidle -w &
/home/simon/dotfiles/scripts/kde_polkit.zsh &
wayland-pipewire-idle-inhibit &

# Shell
/home/simon/dotfiles/scripts/ags.zsh &>> /tmp/ags.log &
sleep 1.5

# Background apps
QT_QPA_PLATFORM=xcb QT_SCALE_FACTOR=1.75 megasync &
copyq --start-server &

# Social apps
alacritty &
TERMINAL_PID=$!
sleep 1
hyprctl dispatch togglegroup

element-desktop &
spotify &
discord &
ferdium &

# Browser
/home/simon/dotfiles/scripts/chrome.zsh &

sleep 7.5 && kill -9 $TERMINAL_PID &
