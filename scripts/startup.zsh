#zsh
# Background apps
/home/simon/Data1/GIT/Other/dotfiles/scripts/ags.zsh &
sleep 0.5
megasync & # Start MegaSync

# Social apps
konsole &
sleep 0.5
hyprctl dispatch togglegroup
element-desktop &
spotify &
discord &
rambox &

# Browser
google-chrome-stable --enable-features=TouchpadOverscrollHistoryNavigation &
