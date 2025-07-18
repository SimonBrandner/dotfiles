#!/usr/bin/env zsh

# Services
swayidle -w -d &>> /tmp/swayidle.log &
/home/simon/dotfiles/scripts/kde_polkit.zsh &
wayland-pipewire-idle-inhibit &
kdeconnect-indicator &

# Shell
# /home/simon/dotfiles/scripts/ags.zsh &>> /tmp/ags.log &
ags run &
sleep 3

# Background apps
megasync &
copyq --start-server &

# Social apps
swaymsg workspace 0
swaymsg layout tabbed

element-desktop &
spotify &
discord &
ferdium &

# Browser
/home/simon/dotfiles/scripts/chrome.zsh &

sleep 7.5 && kill -9 $TERMINAL_PID &
