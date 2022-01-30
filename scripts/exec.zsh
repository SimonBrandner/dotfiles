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
#bash -lic 'LD_PRELOAD=/home/simon/GIT/NotMine/android-messageswm/android-messageswm /home/simon/PortableApps/AndroidMessages/android-messages' & # Start Android Messages
#whatsdesk --no-sandbox & # Start Whatsdesk

/opt/viber/Viber & # Start Viber
spotify & # Start Spotify
discord & # Start Discord
element-desktop-nightly & # Start Element Desktop
#evolution & # Start Evolution
kontact & # Start Kontact
/home/simon/PortableApps/nativefier-apps/todoist-linux-x64/todoist --no-sandbox & # Start Todoist
teams & # Start MS Teams
############################################################
# Setup Workspace 0

# Log devices to debug pipewire
lsof -n /dev/snd/* > ~/snd-lsof.log
