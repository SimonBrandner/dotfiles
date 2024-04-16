#zsh

# Services
hypridle &
hyprpaper &

# Shell
/home/simon/Data1/GIT/Other/dotfiles/scripts/ags.zsh &
sleep 1

# Background apps
QT_QPA_PLATFORM=xcb QT_SCALE_FACTOR=1.75 megasync &
copyq --start-server &

# Social apps
konsole &
KONSOLE_PID=$!
sleep 1
hyprctl dispatch togglegroup

element-desktop &
spotify &
discord &
rambox &

# Browser
/home/simon/Data1/GIT/Other/dotfiles/scripts/chrome.zsh &

sleep 7.5 && kill -9 $KONSOLE_PID &
