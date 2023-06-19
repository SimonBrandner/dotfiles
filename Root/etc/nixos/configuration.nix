# Nix config: $ sudo nixos-rebuild switch

{ config, pkgs, ... }:

{
  # Imports
  imports = [
    ./hardware-configuration.nix
  ];

  # Networking
  networking.hostName = "simon-s-thinkpad-t43Os";
  networking.networkmanager.enable = true;

  # Bluetooth
  hardware.bluetooth.enable = true;
  #services.blueman.enable = true;
  #hardware.pulseaudio.enable = true;


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

  # XServer
  services.xserver.enable = true;
  services.xserver.displayManager.sddm.enable = true;
  services.xserver.desktopManager.plasma5.enable = true;
  services.xserver = {
    layout = "cz";
    xkbVariant = "";
  };

  # Console keymap
  console.keyMap = "cz-lat2";

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
  ];

  # System packages: $ nix search wget
  environment.systemPackages = with pkgs; [
     wget
     micro
     firefox
     google-chrome
     megasync
     discord
     viber
     element-desktop
     spotify
     okular
     vscode
     yarn
     git
     gh
     texlive.combined.scheme-full
     numix-icon-theme-circle
     arc-theme
     arc-kde-theme
     krusader
     zsh
     zsh-history
     zsh-completions
     zsh-autocomplete
     zsh-syntax-highlighting
     zsh-autosuggestions
     neofetch
     teams
     bluez
     blueman
     barrier
     gnupg
     pinentry
     pinentry-curses
     pinentry-qt
     pinentry-gtk2
     python311Packages.pygments
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

  #programs.mtr.enable = true;
  #programs.gnupg.agent = {
  #  enable = true;
  #  enableSSHSupport = true;
  #};

  # Services
  services.openssh.enable = true;

  # Open ports in the firewall.
  networking.firewall.enable = true;
  networking.firewall.allowedTCPPorts = [
    24800
  ];
  # networking.firewall.allowedUDPPorts = [ ... ];

  # System version
  system.stateVersion = "23.05";
}
