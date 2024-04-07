#zsh
# Background apps
/home/simon/Data1/GIT/Other/dotfiles/scripts/ags.zsh &
sleep 0.5
megasync & # Start MegaSync

# Social apps
konsole &
sleep 0.5
hyprctl dispatch togglegroup
element-desktop --enable-features=UseOzonePlatform --ozone-platform=wayland &
spotify --enable-features=UseOzonePlatform --ozone-platform=wayland &
discord --enable-features=UseOzonePlatform --ozone-platform=wayland &
rambox &

# Browser
google-chrome-stable --enable-features=TouchpadOverscrollHistoryNavigation &
