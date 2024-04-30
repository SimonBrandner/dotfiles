#!/usr/bin/env zsh
grim - | satty -f - --output-filename "$XDG_PICTURES_DIR/Screenshots/Screenshot_%Y-%m-%d_%H:%M:%S.png"
