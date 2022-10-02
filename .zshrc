#neofetch # Run neofetch

tabs 4 # Set tab width to 4
set -k # Enable comments
clear

__git_files () {
    _wanted files expl 'local files' _files
}

source ~/Data/GIT/Other/dotfiles/scripts/zsh/prompt.zsh # Prompt
source ~/Data/GIT/Other/dotfiles/scripts/zsh/autocomplete.zsh # Autocomplete
source ~/Data/GIT/Other/dotfiles/scripts/zsh/plugins.zsh # Plugins
source ~/Data/GIT/Other/dotfiles/scripts/zsh/aliases.zsh # Aliases
source ~/Data/GIT/Other/dotfiles/scripts/zsh/path.zsh # Path
#source ~/Data/GIT/Other/dotfiles/scripts/zsh/locale.zsh # Locale
source ~/Data/GIT/Other/dotfiles/scripts/zsh/keybindings.zsh # Keybindings
source ~/Data/GIT/Other/dotfiles/scripts/zsh/history.zsh # History
#source ~/GIT/Other/dotfiles/scripts/zsh/nvm.zsh # NVM
source ~/Data/GIT/Other/dotfiles/scripts/zsh/env.zsh # Variables

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
