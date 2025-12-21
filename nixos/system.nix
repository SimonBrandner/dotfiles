{
  pkgs,
  inputs,
  config,
  ...
}: {
  imports = [
    inputs.home-manager.nixosModules.default
  ];
  system.stateVersion = "23.05";
  time.timeZone = "Europe/Prague";
  home-manager = {
    extraSpecialArgs.inputs = inputs;
    useGlobalPkgs = true;
    useUserPackages = true;
  };
  nix = {
    package = pkgs.nixVersions.stable;
    settings = {
      max-jobs = 8;
      cores = 8;
      auto-optimise-store = true;
      experimental-features = [
        "nix-command"
        "flakes"
      ];
      substituters = [
        "https://cache.nixos.org/"
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
    useXkbConfig = true;
  };
  boot = {
    extraModulePackages = [
      config.boot.kernelPackages.rtl8192eu
    ];
    blacklistedKernelModules = ["rtl8xxxu"];
    supportedFilesystems = ["ntfs"];
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
    networkmanager = {
      enable = true;
      wifi.macAddress = "permanent";
      plugins = [pkgs.networkmanager-openvpn];
    };
    firewall = {
      enable = true;
      allowedTCPPorts = [
        24800 # Barrier
        7000
        7001
        7100 # UxPlay
        22 # SSH
        5900 # VNC
        8008
        25565 # Minecraft
      ];
      allowedUDPPorts = [
        6000
        6001
        7011 # UxPlay
        25565 # Minecraft
      ];
      allowedTCPPortRanges = [
        # KDE Connect
        {
          from = 1714;
          to = 1764;
        }
      ];
      allowedUDPPortRanges = [
        # KDE Connect
        {
          from = 1714;
          to = 1764;
        }
      ];
    };
  };
  hardware = {
    enableAllFirmware = true;
    bluetooth = {
      enable = true;
      powerOnBoot = false;
    };
    graphics = {
      enable = true;
      enable32Bit = true;
    };
  };
  services = {
    pcscd.enable = true;
    printing.enable = true;
    upower.enable = true;
    gvfs.enable = true;
    gnome.glib-networking.enable = true;
    xserver.xkb = {
      layout = "cz";
      variant = "qwertz";
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
    pulseaudio = {
      enable = false;
      support32Bit = true;
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
          command = "${pkgs.tuigreet}/bin/tuigreet --time --time-format '%H:%M:%S' --cmd sway";
        };
      };
    };
  };
  security = {
    rtkit.enable = true;
    polkit.enable = true;
    sudo.configFile = "Defaults env_reset, pwfeedback";
    pam = {
      krb5.enable = false;
      services.ags = {};
    };
  };
  users.users.simon = {
    shell = pkgs.zsh;
    isNormalUser = true;
    description = "Šimon";
    extraGroups = [
      "networkmanager"
      "wheel"
      "docker"
      "audio"
      "wireshark"
    ];
  };
  nixpkgs = {
    config = {
      allowUnfree = true;
      pulseaudio = true;
      permittedInsecurePackages = [
        "python3.12-youtube-dl-2021.12.17"
        "gradle-7.6.6"
      ];
    };
  };
  environment = {
    sessionVariables = {
      NIXOS_OZONE_WL = "1";
      GDK_BACKEND = "wayland,x11";
      GTK_THEME = "Arc-Dark";
      XCURSOR_SIZE = "24";
      XCURSOR_THEME = "breeze_cursors";
      RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
      DEFAULT_BROWSER = "${pkgs.google-chrome}/bin/google-chrome";
    };
    systemPackages = with pkgs; [
      # Low level
      libuv
      shared-mime-info
      libdbusmenu
      libdbusmenu-gtk3
      qt6.qtwayland
      intel-ocl
      intel-compute-runtime
      clinfo
      ntfs3g
      cryfs
      android-file-transfer
      libinput-gestures
      fprintd
      bluez
      blueman
      stdenvNoLibs
      xwayland
      wlr-randr
      clinfo
      libglvnd
      libGL
      virtualgl
      virtualglLib
      procps
      usbutils
      glib
      glibc
      gtk4
      graphene
      libadwaita
      openssl
      fontconfig
      intel-media-driver
      intel-vaapi-driver
      libva-vdpau-driver
      libvdpau-va-gl
      brightnessctl
      wl-clipboard
      xdg-utils
      libqalculate
      wayland-pipewire-idle-inhibit
      gsettings-desktop-schemas
      tio
      man-pages

      # ZSH
      zsh
      zsh-completions
      zsh-autocomplete
      zsh-syntax-highlighting
      zsh-autosuggestions
      zsh-powerlevel10k
      zsh-nix-shell

      # Nix
      nil
      alejandra

      # HTML
      html-tidy

      # Python
      pyright
      poetry
      python3
      python312
      python312Packages.black
      python311Packages.pyqt5
      python311Packages.pyqt6
      python311Packages.pygments
      python311Packages.pipx
      python311Packages.pip
      python311Packages.xlrd
      python311Packages.tkinter
      python311Packages.numpy
      python311Packages.pillow

      # JavaScript
      nodePackages.typescript-language-server
      nodePackages.typescript
      nodePackages.prettier
      vscode-langservers-extracted
      nodejs

      # Rust
      rustfmt
      rust-code-analysis
      rust-analyzer
      rustc

      # Java
      gradle
      maven
      jdt-language-server
      javaPackages.openjfx21

      # Lua
      lua-language-server
      luajitPackages.luautf8
      luajitPackages.luarocks
      stylua

      # Typst
      typst
      tinymist
      typstyle

      # TeX
      texlive.combined.scheme-full
      texlab

      # Haskell
      stack
      ghc

      # Agda
      (
        agda.withPackages
        [agdaPackages.standard-library]
      )

      # Assembly
      asm-lsp
      asmfmt

      # Toml
      taplo

      # Julia
      julia

      # Markdown
      marksman

      # C/C++
      clang
      clang-tools
      valgrind
      lldb
      gdb

      # Libs for Qt5
      kdePackages.qt6ct
      kdePackages.breeze
      kdePackages.breeze-gtk
      kdePackages.breeze-icons

      kdePackages.polkit-kde-agent-1
      kdePackages.kdeconnect-kde
      kdePackages.kmines
      kdePackages.ktorrent
      kdePackages.okular
      kdePackages.kdenlive
      kdePackages.gwenview
      kdePackages.kruler

      # XFCE
      xfce.xfburn

      # Terminal applications
      tldr
      lazygit
      wayvnc
      wlvncc
      inotify-tools
      abcde
      sassc
      bun
      direnv
      smartmontools
      nix-direnv
      zplug
      imagemagick
      sqlx-cli
      fastfetch
      pkg-config
      docker
      docker-client
      docker-compose
      xorg.xdpyinfo
      rar
      unrar
      p7zip
      zip
      unzip
      lm_sensors
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
      git-lfs
      gh
      gcc
      gnumake
      nmap
      pinentry-qt
      pinentry-curses
      killall
      powertop
      ffmpeg
      mesa-demos
      bat
      dpkg
      uxplay
      vitetris
      sl
      cmatrix
      meson
      ninja
      cmake
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
      swaylock
      neovim
      vim-full
      playerctl
      tree
      ripgrep
      jq
      wl-mirror
      distrobox
      ascii
      qemu
      lolcat
      radare2
      ghidra-bin

      # Desktop applications
      filezilla
      qtrvsim
      selectdefaultapplication
      pavucontrol
      networkmanagerapplet
      vscode
      element-desktop
      pinentry-qt
      showmethekey
      tor-browser
      prismlauncher
      steam
      alacritty
      calibre
      google-chrome
      firefox
      qdirstat
      megasync
      discord
      ferdium
      geogebra6
      spotify
      pympress
      blender
      gimp
      krita
      inkscape
      obs-studio
      vlc
      mpv
      mediainfo
      glaxnimate
      libreoffice-qt
      chromedriver
      handbrake
      sqlitebrowser
      audacity
      copyq
      satty
      jetbrains.idea-community-bin
      wdisplays
      prusa-slicer
      bleachbit
      iaito

      # Theming
      numix-icon-theme-circle
      arc-theme
      arc-kde-theme
      papirus-icon-theme
    ];
  };
  virtualisation.podman = {
    enable = true;
    dockerCompat = true;
  };
  qt = {
    enable = true;
    platformTheme = "qt5ct";
  };
  fonts.packages = with pkgs; [
    noto-fonts
    noto-fonts-cjk-sans
    noto-fonts-color-emoji
    liberation_ttf
    fira-code
    fira-code-symbols
    meslo-lgs-nf
    corefonts
    vista-fonts
  ];
  programs = {
    zsh.enable = true;
    partition-manager.enable = true;
    kdeconnect.enable = true;
    sway = {
      enable = true;
      package = pkgs.swayfx;
    };
    gnupg.agent = {
      enable = true;
      pinentryPackage = pkgs.pinentry-qt;
      enableSSHSupport = true;
    };
    yazi = {
      enable = true;
    };
    java = {
      enable = true;
      package =
        pkgs.jdk21.override {enableJavaFX = true;};
    };
    wireshark = {
      package = pkgs.wireshark;
      enable = true;
    };
  };
}
