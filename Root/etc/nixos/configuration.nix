# Nix config: $ sudo nixos-rebuild switch

{ config, pkgs, ... }:

{
  # Imports
  imports = [
    ./hardware-configuration.nix
  ];

  # Networking
  networking.networkmanager.enable = true;

  # Bluetooth
  hardware.bluetooth.enable = true;

  # Locales
  time.timeZone = "Europe/Prague";
  i18n.defaultLocale = "en_US.UTF-8";
  i18n.extraLocaleSettings = {
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

  # Hyprland
  #programs.hyprland.enable = true;
  
  # XServer
  services.xserver.enable = true;
  services.xserver.displayManager.sddm.enable = true;
  services.xserver.desktopManager.plasma5.enable = true;
  services.xserver = {
    layout = "cz";
    xkbVariant = "";
  };

  # Console keymap
  console = {
    earlySetup = true;
    keyMap = "cz-lat2";
  };
  

  # CUPS
  services.printing.enable = true;

  # Pipewire
  sound.enable = true;
  hardware.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
  };

  security.sudo.configFile = "Defaults env_reset, pwfeedback";

  # Users
  users.users.simon = {
    isNormalUser = true;
    description = "Šimon";
    extraGroups = [ "networkmanager" "wheel" ];
    packages = with pkgs; [
    
    ];
  };

  # Package config
  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.permittedInsecurePackages = [
    "openssl-1.1.1u"
    "python-2.7.18.6"
    "nodejs-14.21.3"
    "electron-13.6.9"
  ];

  # System packages
  environment.systemPackages = with pkgs; [
     # Low level
     libinput-gestures
     fprintd
     bluez
     blueman
     stdenvNoLibs

     # ZSH
     zsh
     zsh-history
     zsh-completions
     zsh-autocomplete
     zsh-syntax-highlighting
     zsh-autosuggestions
     zsh-powerlevel10k

     #hyprland

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
     #davinci-resolve

     # Theming
     numix-icon-theme-circle
     arc-theme
     arc-kde-theme
  ];

  # Fonts
  fonts.fonts = with pkgs; [
    noto-fonts
    noto-fonts-cjk
    noto-fonts-emoji
    liberation_ttf
    fira-code
    fira-code-symbols
    meslo-lgs-nf
  ];

  # ZSH
  programs.zsh = {
    enable = true;
    autosuggestions.enable = true;
    syntaxHighlighting.enable = true;
  };

  # GPG
  services.pcscd.enable = true;
  programs.gnupg.agent = {
    enable = true;
    pinentryFlavor = "gtk2";
    enableSSHSupport = true;
  };

  # Services
  services.openssh.enable = true;

  # Open ports in the firewall.
  networking.firewall.enable = true;
  networking.firewall.allowedTCPPorts = [
    24800
  ];
  networking.firewall.allowedUDPPorts = [ ];

  system.stateVersion = "23.05";

  nix.settings.experimental-features = [
    "nix-command"
    "flakes"
  ];
}

