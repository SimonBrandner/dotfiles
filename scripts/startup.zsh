#!/usr/bin/env zsh

# Services
swayidle -w -d &>> /tmp/swayidle.log &
/home/simon/dotfiles/scripts/kde_polkit.zsh &
wayland-pipewire-idle-inhibit &
kdeconnect-indicator &
wl-paste --type text --watch cliphist store &

# Shell
/home/simon/dotfiles/scripts/start-ags.zsh &
sleep 5

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
