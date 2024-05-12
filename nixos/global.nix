{ config, pkgs, inputs, ... }:
let
  hyprland-nixpkgs = inputs.hyprland.inputs.nixpkgs.legacyPackages.${pkgs.stdenv.hostPlatform.system};
in
{
  imports = [
    inputs.home-manager.nixosModules.default
    inputs.hyprland.nixosModules.default
  ];
  system.stateVersion = "23.05";
  time.timeZone = "Europe/Prague";
  sound.enable = true;
  home-manager = {
    extraSpecialArgs.inputs = inputs;
    useGlobalPkgs = true;
    useUserPackages = true;
    users = {
      "simon" = import ./home.nix;
    };
  };
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
        7000
        7001
        7100 # UxPlay
        22 # SSH
        8008
      ];
      allowedUDPPorts = [
        6000
        6001
        7011 # UxPlay
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
    opengl = {
      enable = true;
      driSupport32Bit = true;
      package = hyprland-nixpkgs.mesa.drivers;
      package32 = hyprland-nixpkgs.pkgsi686Linux.mesa.drivers;
    };
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
    upower.enable = true;
    gvfs.enable = true;
    gnome.glib-networking.enable = true;
    tlp = {
      enable = true;
      settings = {
        DEVICES_TO_DISABLE_ON_STARTUP = "bluetooth wwan";
        PLATFORM_PROFILE_ON_BAT = "low-power";
        CPU_MAX_PERF_ON_BAT = "80";
      };
    };
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
      nssmdns4 = true;
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
      wireplumber.enable = true;
      alsa = {
        enable = true;
        support32Bit = true;
      };
    };
    greetd = {
      enable = true;
      settings = {
        default_session = {
          command = "${pkgs.greetd.tuigreet}/bin/tuigreet --time --time-format '%H:%M:%S' --cmd Hyprland";
        };
      };
    };
  };
  security = {
    rtkit.enable = true;
    pam.krb5.enable = false;
    polkit.enable = true;
    sudo.configFile = "Defaults env_reset, pwfeedback";
    pam.services.ags = { };
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
    config = {
      allowUnfree = true;
      pulseaudio = true;
      permittedInsecurePackages = [ ];
    };
  };
  environment = {
    sessionVariables = rec {
      NIXOS_OZONE_WL = "1";
      GDK_SCALE = "2";
      GDK_BACKEND = "wayland,x11";
      GTK_THEME = "Arc-Dark";
      QT_QPA_PLATFORM = "wayland;xcb";
      QT_AUTO_SCREEN_SCALE_FACTOR = "1";
      XCURSOR_SIZE = "24";
      XDG_CURRENT_DESKTOP = "Hyprland";
      XDG_SESSION_DESKTOP = "Hyprland";
      RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
      DEFAULT_BROWSER = "${pkgs.google-chrome}/bin/google-chrome";
    };
    systemPackages = with pkgs; [
      # Low level
      shared-mime-info
      libdbusmenu
      libdbusmenu-gtk3
      qt6.qtwayland
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
      xwaylandvideobridge
      wl-clipboard
      xdg-utils
      xdg-desktop-portal-hyprland
      libqalculate
      wayland-pipewire-idle-inhibit
      auto-cpufreq

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
      nixpkgs-fmt

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
      julia_19-bin
      nodejs
      jdk17

      # Libs for Qt5
      libsForQt5.kdeconnect-kde
      libsForQt5.kmines
      libsForQt5.ktorrent
      libsForQt5.qt5ct
      libsForQt5.polkit-kde-agent

      # Terminal applications
      inotify-tools
      sassc
      bun
      direnv
      nix-direnv
      zplug
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
      grim
      slurp
      john
      hash-identifier
      bluetuith
      swayidle
      satty

      # Desktop applications
      nwg-look
      pavucontrol
      vmware-horizon-client
      vscode
      vscode-extensions.rust-lang.rust-analyzer
      element-desktop
      element-desktop-wayland
      pinentry-qt
      tor-browser-bundle-bin
      barrier
      prismlauncher
      kitty
      calibre
      google-chrome
      lmms
      megasync
      discord
      rambox
      geogebra6
      spotify
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
      konsole
      gwenview
      copyq
      godot_4

      # Theming
      numix-icon-theme-circle
      arc-theme
      arc-kde-theme
      papirus-icon-theme
    ];
  };
  qt = {
    enable = true;
    platformTheme = "qt5ct";
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
  programs = {
    hyprland = {
      xwayland.enable = true;
      enable = true;
    };
    partition-manager.enable = true;
    kdeconnect.enable = true;
    gnupg.agent = {
      enable = true;
      pinentryPackage = pkgs.pinentry-qt;
      enableSSHSupport = true;
    };
  };
  xdg.portal = {
    enable = true;
    wlr.enable = true;
  };
}
