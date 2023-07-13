#!/usr/bin/zsh

#source ~/GIT/Other/dotfiles/scripts/zsh/locale.zsh # Locale
#loginctl lock-session # Lock screen

# Setup background apps
############################################################
megasync & # Start MegaSync
picom & # Start Picom
ulauncher --hide-window &
#bash /home/simon/.config/conky/conky.sh & # Start Conky
#sleep 5
#variety -n & # Start Variety
############################################################
# Setup background apps

# Cleanup
############################################################
rm ~/core # Remove the core file
############################################################
# Cleanup

# Setup Workspace 0
############################################################
i3-msg 'workspace 0; append_layout /home/simon/Data1/GIT/Other/dotfiles/i3Layouts/workspace-0.json' & # Set layout workspace 0

/opt/viber/Viber & # Start Viber
spotify & # Start Spotify
discord & # Start Discord
element-desktop-nightly & # Start Element Desktop
rambox --no-sandbox & # Start Rambox
#teams & # Start MS Teams
############################################################
# Setup Workspace 0
