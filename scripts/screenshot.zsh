#!/usr/bin/env zsh

if [ -z "$HYPRLAND_INSTANCE_SIGNATURE" ]; then
	output="$(swaymsg -r -t get_outputs | jq -r '.[] | select(.focused == true) | .name')"
else
	output="$(hyprctl monitors | grep "ID $(hyprctl activeworkspace | grep monitorID | awk '{print $2}')" | awk '{print $2}')"
fi

file="$XDG_PICTURES_DIR/Screenshots/Screenshot_%Y-%m-%d_%H:%M:%S.png"

grim -t ppm -o $output - | satty -f - --output-filename $file

