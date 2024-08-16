#!/usr/bin/env zsh
output="$(hyprctl monitors | grep "ID $(hyprctl activeworkspace | grep monitorID | awk '{print $2}')" | awk '{print $2}')"
file="$XDG_PICTURES_DIR/Screenshots/Screenshot_%Y-%m-%d_%H:%M:%S.png"

grim -t ppm -o $output - | satty -f - --output-filename $file

