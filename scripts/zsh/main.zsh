tabs 4 # Set tab width to 4
set -k # Enable comments
clear

__git_files () {
    _wanted files expl 'local files' _files
}

source ~/dotfiles/scripts/zsh/p10k.zsh # Prompt
source ~/dotfiles/scripts/zsh/autocomplete.zsh # Autocomplete
source ~/dotfiles/scripts/zsh/aliases.zsh # Aliases
source ~/dotfiles/scripts/zsh/path.zsh # Path
source ~/dotfiles/scripts/zsh/keybindings.zsh # Keybindings
source ~/dotfiles/scripts/zsh/history.zsh # History
source ~/dotfiles/scripts/zsh/env.zsh # Variables
