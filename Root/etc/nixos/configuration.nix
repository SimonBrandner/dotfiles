{ config, pkgs, ... }:

let 
  unstable-pkgs = import <nixos-unstable> {
    config = config.nixpkgs.config;
  };
in {
  imports = [
    ./hardware-configuration.nix
  ];
  system.stateVersion = "23.05";
  time.timeZone = "Europe/Prague";
  sound.enable = true;
  nix = {
    settings = {
      max-jobs = 8;
      cores = 8;
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
        7000 7001 7100 # UxPlay
        22 # SSH
        8008
      ];
      allowedUDPPorts = [
      	6000 6001 7011 # UxPlay
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
    enableAllFirmware = true;
    bluetooth.enable = true;
    pulseaudio = {
      enable = false;
      support32Bit = true;
    };
    opengl = {
      enable = true;
      extraPackages = with pkgs; [
        intel-media-driver
        vaapiIntel
        vaapiVdpau
        libvdpau-va-gl
        intel-ocl
        intel-compute-runtime
        unstable-pkgs.mesa
        unstable-pkgs.mesa.opencl
      ];
    };
  };
  services = {
    rdnssd.enable = true;
    pcscd.enable = true;
    printing.enable = true;
    openssh = {
      enable = true;
      allowSFTP = true;
      settings = {
      	X11Forwarding = true;
      	PasswordAuthentication = true;
      	PermitRootLogin = "no";
      };
    };
    avahi = {
      enable = true;
      nssmdns = true;
      openFirewall = true;
      publish = {
        enable = true;
        addresses = true;
        workstation = true;
        userServices = true;
        domain = true;
      };
    };
    pipewire = {
      enable = true;
      pulse.enable = true;
      alsa = {
        enable = true;	
        support32Bit = true;
      };
    };
    xserver = {
      layout = "cz";
      enable = true;
      xkbVariant = "";
      desktopManager.plasma5.enable = true;
      displayManager = {
        xserverArgs = [
          "-dpi 96"
        ];
        sddm = {
          enable = true;
          enableHidpi = true;
          setupScript = ''
            xrandr --output eDP-1 --mode 2880x1801 --rate 90.00
          '';
        };
      };
    };
  };
  security = {
    rtkit.enable = true;
    sudo.configFile = "Defaults env_reset, pwfeedback";
  };
  users.users.simon = {
    isNormalUser = true;
    description = "Šimon";
    extraGroups = [
      "networkmanager"
      "wheel"
      "docker"
      "audio"
    ];
  };
  nixpkgs.config = {
    allowUnfree = true;
    pulseaudio = true;
    permittedInsecurePackages = [
      "openssl-1.1.1v"
      "openssl-1.1.1w"
      "python-2.7.18.6"
      "nodejs-14.21.3"
      "electron-13.6.9"
      "electron-14.2.9"
    ];
  };
  environment = {
    systemPackages = with pkgs; [
      # Low level
      qt6.qtwayland
      unstable-pkgs.mesa.opencl
      unstable-pkgs.mesa
      intel-ocl
      intel-compute-runtime
      clinfo
      ntfs3g
      libinput-gestures
      fprintd
      bluez
      blueman
      stdenvNoLibs
      xwayland
      wlr-randr
      opencl-info
      libglvnd
      libGL
      virtualgl
      virtualglLib
      cairo
      cairomm
      cairo-lang
      cairomm
      procps
      usbutils
      glib
      glibc
      gtk4
      graphene
      libadwaita

      # ZSH
      zsh
      zsh-history
      zsh-completions
      zsh-autocomplete
      zsh-syntax-highlighting
      zsh-autosuggestions
      zsh-powerlevel10k

      # Programming/markup languages
      poetry
      python3
      python311Packages.pyqt5
      python311Packages.pyqt6
      python311Packages.python-pam
      python311Packages.pygments
      python311Packages.pipx
      python311Packages.pip
      python311Packages.wheel

      nodePackages.typescript

      rustfmt
      rust-code-analysis
      rust-analyzer
      rustup
      cargo

      sonic-pi
      texlive.combined.scheme-full
      julia_18-bin
      nodejs
      jdk17

      # Libs for Qt5     
      libsForQt5.plasma-wayland-protocols
      libsForQt5.kwayland-integration
      libsForQt5.kwayland
      libsForQt5.kdeconnect-kde
      libsForQt5.kmines
      libsForQt5.kcolorchooser

      # Terminal applications
      pkg-config
      docker
      docker-client
      docker-compose
      xorg.xdpyinfo
      testdisk
      rar
      unrar
      p7zip
      zip
      unzip
      links2
      gnupg
      wget
      micro
      abcm2ps
      mc
      htop
      yarn
      yarn2nix
      git
      gh
      gcc
      gnumake
      nmap
      pinentry
      pinentry-curses
      killall
      powertop
      ffmpeg
      glxinfo
      bat
      dpkg
      uxplay
      vitetris
      sl
      cmatrix
      meson
      ninja
      cmake
      youtube-dl
      yt-dlp
      sqlite
      lsof

      # Desktop applications
      vmware-horizon-client
      unstable-pkgs.vscode
      vscode-extensions.rust-lang.rust-analyzer
      element-desktop
      element-desktop-wayland
      pinentry-qt
      pinentry-gtk2
      tor-browser-bundle-bin
      barrier
      prismlauncher
      kitty
      calibre
      firefox
      google-chrome
      lmms
      unstable-pkgs.megasync
      discord
      unstable-pkgs.rambox
      geogebra6
      spotify
      okular
      falkon
      krusader
      blender
      gimp
      inkscape
      neofetch
      obs-studio
      vlc
      kdenlive
      mediainfo
      glaxnimate
      libreoffice-qt
      chromedriver
      handbrake
      tartube
      media-downloader
      sqlitebrowser
      audacity
      unstable-pkgs.davinci-resolve
      godot_4

      # Theming
      numix-icon-theme-circle
      arc-theme
      arc-kde-theme
    ];
    sessionVariables = rec {
      RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };
  };
  fonts.packages = with pkgs; [
    noto-fonts
    noto-fonts-cjk
    noto-fonts-emoji
    liberation_ttf
    fira-code
    fira-code-symbols
    meslo-lgs-nf
    corefonts
    vistafonts
  ];
  virtualisation.docker.enable = true;
  programs = {
    kdeconnect.enable = true;
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
  };
}
