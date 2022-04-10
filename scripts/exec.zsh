#!/usr/bin/zsh

#source ~/GIT/Other/dotfiles/scripts/zsh/locale.zsh # Locale
#loginctl lock-session # Lock screen

# Setup background apps
############################################################
#latte-dock & # Start LatteDock
#barrier" # Start Barrier
picom --experimental-backends & # Start Picom
#bash /home/simon/.config/conky/conky.sh & # Start Conky
sleep 5
flatpak run nz.mega.MEGAsync & # Start MEGASync
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
i3-msg 'workspace 0; append_layout /home/simon/GIT/Other/dotfiles/i3Layouts/workspace-0.json' & # Set layout workspace 0

/opt/viber/Viber & # Start Viber
spotify & # Start Spotify
discord & # Start Discord
element-desktop-nightly & # Start Element Desktop
rambox & # Start Rambox
teams & # Start MS Teams
#evolution & # Start Evolution
#kontact & # Start Kontact
#/home/simon/PortableApps/nativefier-apps/todoist-linux-x64/todoist --no-sandbox & # Start Todoist
############################################################
# Setup Workspace 0
