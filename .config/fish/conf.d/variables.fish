# XDG
###################################################

set -x XDG_CONFIG_DIRS /etc/xdg

set -x XDG_CACHE_HOME $HOME/.cache
set -x XDG_CONFIG_HOME $HOME/.config
set -x XDG_DATA_HOME $HOME/.local/share
###################################################
# XDG

# Env varibles
# set fish_user_paths '/home/simon/.local/lib/python3.7/site-packages/' $fish_user_paths
set fish_user_paths '/usr/local/bin/' $fish_user_paths
set fish_user_paths '/snap/bin' $fish_user_paths
set fish_user_paths '/snap/bin' $fish_user_paths
set fish_user_paths '/usr/games' $fish_user_paths
set fish_user_paths '/usr/local/games' $fish_user_paths
set fish_user_paths '/home/simon/GIT/Frameworks/flutter/bin' $fish_user_paths
# Env varibles

# Locale
export LANG=en_US.utf8
export LANGUAGE=en_US.utf8
export LC_CTYPE=cs_CZ.utf8
export LC_NUMERIC=cs_CZ.utf8
export LC_COLLATE=cs_CZ.utf8
export LC_MONETARY=cs_CZ.utf8
export LC_MESSAGES=cs_CZ.utf8
export LC_PAPER=cs_CZ.utf8
export LC_NAME=cs_CZ.utf8
export LC_ADDRESS=cs_CZ.utf8
export LC_TELEPHONE=cs_CZ.utf8
export LC_MEASUREMENT=cs_CZ.utf8
export LC_IDENTIFICATION=cs_CZ.utf8
export LC_TIME=en_ISO.utf8
# Locale

# Tab size
tabs 4
# Tab size
