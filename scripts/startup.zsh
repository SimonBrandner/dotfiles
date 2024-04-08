#zsh

# Services
hypridle &

# Shell
/home/simon/Data1/GIT/Other/dotfiles/scripts/ags.zsh &
sleep 0.5

# Background apps
megasync & # Start MegaSync

# Social apps
konsole &
KONSOLE_PID = $!
sleep 0.5
hyprctl dispatch togglegroup

element-desktop &
spotify &
discord &
rambox &
kill -9 $KONSOLE_PID

# Browser
google-chrome-stable --enable-features=TouchpadOverscrollHistoryNavigation &
