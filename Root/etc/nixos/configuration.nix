{ config, pkgs, ... }:

{
  imports = [
    ./hardware-configuration.nix
  ];

  system.stateVersion = "23.05";
  time.timeZone = "Europe/Prague";
  sound.enable = true;

  nix = {
    settings = {
      auto-optimise-store = true;
      experimental-features = [
        "nix-command"
        "flakes"
      ];
    };
    gc = {
      automatic = true;
      dates = "daily";
      options = "--delete-older-than 7d";
    };
  };

  console = {
    earlySetup = true;
    keyMap = "cz-lat2";
  };

  i18n = {
    defaultLocale = "en_US.UTF-8";
    extraLocaleSettings = {
      LC_ADDRESS = "cs_CZ.UTF-8";
      LC_IDENTIFICATION = "cs_CZ.UTF-8";
      LC_MEASUREMENT = "cs_CZ.UTF-8";
      LC_MONETARY = "cs_CZ.UTF-8";
      LC_NAME = "cs_CZ.UTF-8";
      LC_NUMERIC = "cs_CZ.UTF-8";
      LC_PAPER = "cs_CZ.UTF-8";
      LC_TELEPHONE = "cs_CZ.UTF-8";
      LC_TIME = "cs_CZ.UTF-8";
    };
  };


  networking = {
    networkmanager.enable = true;
    firewall = {
      enable = true;
      allowedTCPPorts = [
        24800 # Barrier
      ];
      allowedTCPPortRanges = [ 
        { from = 1714; to = 1764; } # KDE Connect
      ];  
      allowedUDPPortRanges = [ 
        { from = 1714; to = 1764; } # KDE Connect
      ];  
    };
  };

  hardware = {
    bluetooth.enable = true;
    pulseaudio.enable = false;
  };

  services = {
    openssh.enable = true;
    pcscd.enable = true;
    printing.enable = true;
    pipewire = {
      enable = true;
      alsa.enable = true;
      alsa.support32Bit = true;
      pulse.enable = true;
    };
    xserver = {
      layout = "cz";
      enable = true;
      xkbVariant = "";
      displayManager.sddm.enable = true;
      desktopManager.plasma5.enable = true;
    };
  };

  security = {
    rtkit.enable = true;
    sudo.configFile = "Defaults env_reset, pwfeedback";
  };

  users.users.simon = {
    isNormalUser = true;
    description = "Šimon";
    extraGroups = [ "networkmanager" "wheel" ];
  };

  nixpkgs.config = {
    allowUnfree = true;
    permittedInsecurePackages = [
      "openssl-1.1.1u"
      "python-2.7.18.6"
      "nodejs-14.21.3"
      "electron-13.6.9"
    ];
  };

  environment.systemPackages = with pkgs; [
     # Low level
     libinput-gestures
     fprintd
     bluez
     blueman
     stdenvNoLibs
     xwayland
     qt6.qtwayland

     libsForQt5.plasma-wayland-protocols
     libsForQt5.kwayland-integration
     libsForQt5.kwayland
     libsForQt5.kdeconnect-kde

     # ZSH
     zsh
     zsh-history
     zsh-completions
     zsh-autocomplete
     zsh-syntax-highlighting
     zsh-autosuggestions
     zsh-powerlevel10k


     # Programming/markup languages
     python3
     python311Packages.python-pam
     python311Packages.pygments

     julia_18-bin
     nodejs
     texlive.combined.scheme-full
     
     # Terminal applications
     gnupg
     wget
     micro
     mc
     htop
     yarn
     git
     gh
     gcc
     gnumake
     nmap
     pinentry
     pinentry-curses
     killall
     powertop

     # Desktop applications
     barrier
     kitty
     firefox
     google-chrome
     megasync
     discord
     viber
     element-desktop
     element-desktop-wayland
     spotify
     okular
     krusader
     blender
     gimp
     inkscape
     neofetch
     teams
     vscode
     pinentry-qt
     pinentry-gtk2

     # Theming
     numix-icon-theme-circle
     arc-theme
     arc-kde-theme
  ];

  fonts.fonts = with pkgs; [
    noto-fonts
    noto-fonts-cjk
    noto-fonts-emoji
    liberation_ttf
    fira-code
    fira-code-symbols
    meslo-lgs-nf
  ];

  programs = {
    zsh = {
      enable = true;
      autosuggestions.enable = true;
      syntaxHighlighting.enable = true;
    };
    gnupg.agent = {
      enable = true;
      pinentryFlavor = "gtk2";
      enableSSHSupport = true;
    };
    kdeconnect.enable = true;
  };
}
