#zsh

# Services
hypridle &
hyprpaper &

# Shell
/home/simon/Data1/GIT/Other/dotfiles/scripts/ags.zsh &
sleep 0.5

# Background apps
QT_QPA_PLATFORM=xcb QT_SCALE_FACTOR=1.75 megasync & # Start MegaSync

# Social apps
konsole &
KONSOLE_PID=$!
sleep 0.5
hyprctl dispatch togglegroup

element-desktop &
spotify &
discord &
rambox &

# Browser
google-chrome-stable --enable-features=TouchpadOverscrollHistoryNavigation &

sleep 3
kill -9 $KONSOLE_PID
