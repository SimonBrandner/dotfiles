tabs 4 # Set tab width to 4
set -k # Enable comments
clear

__git_files () {
    _wanted files expl 'local files' _files
}

source ~/Data1/GIT/Other/dotfiles/scripts/zsh/prompt.zsh # Prompt
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/autocomplete.zsh # Autocomplete
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/plugins.zsh # Plugins
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/aliases.zsh # Aliases
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/path.zsh # Path
#source ~/Data1/GIT/Other/dotfiles/scripts/zsh/locale.zsh # Locale
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/keybindings.zsh # Keybindings
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/history.zsh # History
#source ~/Data1/GIT/Other/dotfiles/scripts/zsh/nvm.zsh # NVM
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/env.zsh # Variables
source ~/Data1/GIT/Other/dotfiles/scripts/zsh/kdesrc.zsh # KDE SRC

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

fastfetch # Run fastfetch
