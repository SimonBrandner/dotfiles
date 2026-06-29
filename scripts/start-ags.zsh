#!/usr/bin/env zsh

mkdir -p ~/.local/state/ags
ags run ~/dotfiles/config/ags/app.tsx &>> ~/.local/state/ags/ags-$(date +"%Y-%m-%d-%H:%M:%S").log
