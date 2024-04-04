{ config, pkgs, inputs, ... }: let
  agsPkg = inputs.ags.packages.${pkgs.system}.agsWithTypes;
in {
  system.stateVersion = "23.05";
  time.timeZone = "Europe/Prague";
  sound.enable = true;
  nix = {
    package = pkgs.nixFlakes;
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
  boot.supportedFilesystems = [
    "ntfs"
  ];
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
    opengl.enable = true;
    pulseaudio = {
      enable = false;
      support32Bit = true;
    };
  };
  services = {
    rdnssd.enable = true;
    pcscd.enable = true;
    printing.enable = true;
    flatpak.enable = true;
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
    pam.krb5.enable = false;
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
  nixpkgs = {
    overlays = [
      (final: _prev: {
        unstable = import inputs.nixpkgs-unstable {
          system = final.system;
          config = {
            allowUnfree = true;
            permittedInsecurePackages = [
           	  "freeimage-unstable-2021-11-01"
            ];
          };
        };
      })
    ];
    config = {
      allowUnfree = true;
      pulseaudio = true;
      permittedInsecurePackages = [];
    };
  };
  environment = {
    etc."ags-types".source = "${agsPkg}/share/com.github.Aylur.ags/types";
    systemPackages = with pkgs; [
      # Low level
      libdbusmenu
      libdbusmenu-gtk3
      qt6.qtwayland
      mesa.opencl
      mesa
      mesa.opencl
      intel-ocl
      unstable.intel-compute-runtime
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
      openssl
      SDL
      SDL2
      fontconfig
      clang
      intel-media-driver
      vaapiIntel
      vaapiVdpau
      libvdpau-va-gl
      brightnessctl

      # ZSH
      zsh
      zsh-history
      zsh-completions
      zsh-autocomplete
      zsh-syntax-highlighting
      zsh-autosuggestions
      zsh-powerlevel10k
      zsh-nix-shell

      # Programming/markup languages
      poetry
      python3
      python311Packages.pyqt5
      python311Packages.pyqt6
      python311Packages.pygments
      python311Packages.pipx
      python311Packages.pip
      python311Packages.xlrd
      python311Packages.tkinter

      nodePackages.typescript

      rustfmt
      rust-code-analysis
      rust-analyzer
      rustup
      cargo
      evcxr

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
      libsForQt5.ktorrent

      # Terminal applications
      sassc
      bun
      direnv
      nix-direnv
      imagemagick
      sqlx-cli
      fastfetch
      flatpak-builder
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
      litecli
      lsof

      # Desktop applications
      pavucontrol
      vmware-horizon-client
      unstable.vscode
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
      unstable.megasync
      discord
      unstable.rambox
      geogebra6
      spotify
      spotify-tui
      okular
      falkon
      krusader
      blender
      gimp
      inkscape
      fastfetch
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
      stacer
      audacity
      unstable.hyprlock
      unstable.hyprcursor
      unstable.godot_4
      agsPkg
      #unstable.davinci-resolve

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
    hyprland.enable = true;
    partition-manager.enable = true;
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
