#zsh

/nix/store/$(ls -la /nix/store | grep polkit-kde-agent | grep '^d' | awk '{print $8}')/libexec/polkit-kde-authentication-agent-1
