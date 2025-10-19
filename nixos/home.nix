{
  config,
  pkgs,
  inputs,
  lib,
  ...
}: let
  gtk-session-lock = inputs.gtk-session-lock.packages.${pkgs.system}.default;
in {
  imports = [
    inputs.ags.homeManagerModules.default
  ];
  programs = {
    home-manager.enable = true;
    ags = {
      enable = true;
      extraPackages = with pkgs; [
        inputs.ags.packages.${pkgs.system}.wireplumber
        inputs.ags.packages.${pkgs.system}.notifd
        inputs.ags.packages.${pkgs.system}.battery
        inputs.ags.packages.${pkgs.system}.bluetooth
        inputs.ags.packages.${pkgs.system}.apps
        inputs.ags.packages.${pkgs.system}.auth
        inputs.ags.packages.${pkgs.system}.hyprland
        inputs.ags.packages.${pkgs.system}.mpris
        inputs.ags.packages.${pkgs.system}.network
        inputs.ags.packages.${pkgs.system}.tray
        inputs.ags.packages.${pkgs.system}.io
        inputs.ags.packages.${pkgs.system}.astal3
        fzf
        gtksourceview
        webkitgtk
        accountsservice
        gtk-session-lock
      ];
    };
    zsh = {
      enable = true;
      syntaxHighlighting.enable = true;
      initContent = ''
        [[ ! -f ${../scripts/zsh/main.zsh} ]] || source ${../scripts/zsh/main.zsh}
      '';
      zplug = {
        enable = true;
        plugins = [
          {
            name = "zsh-users/zsh-autosuggestions";
          }
          {
            name = "romkatv/powerlevel10k";
            tags = ["as:theme" "depth:1"];
          }
        ];
      };
    };
  };
  gtk = {
    enable = true;
    cursorTheme = {
      name = "breeze_cursors";
      size = 24;
    };
  };
  home = {
    username = "simon";
    homeDirectory = "/home/simon";
    stateVersion = "23.05";
    activation.hypr = lib.hm.dag.entryAfter ["writeBoundary"] "mkdir -p ~/.config/hypr";
    file = {
      ".config/kdeglobals" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/kdeglobals";
      };
      ".astylerc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/astylerc";
      };
      ".clang-format" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/clang-format";
      };
      ".uncrustify.cfg" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/uncrustify.cfg";
      };
      ".config/mimeapps.list" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/mimeapps.list";
      };
      ".config/mc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/mc";
        recursive = true;
      };
      ".config/yazi" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/yazi";
        recursive = true;
      };
      ".config/satty" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/satty";
        recursive = true;
      };
      ".config/lazygit" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/lazygit";
        recursive = true;
      };
      ".config/qt5ct" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/qt5ct";
        recursive = true;
      };
      ".config/wayland-pipewire-idle-inhibit" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/wayland-pipewire-idle-inhibit";
        recursive = true;
      };
      ".config/swayidle" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/swayidle";
        recursive = true;
      };
      ".config/alacritty" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/alacritty";
        recursive = true;
      };
      ".config/nvim" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/nvim";
        recursive = true;
      };
      ".config/ags" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/ags";
        recursive = true;
      };
      ".config/sway" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/sway";
        recursive = true;
      };
      ".config/swaylock" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/swaylock";
        recursive = true;
      };
      "dotfiles/config/ags/types" = {
        source = "${config.programs.ags.finalPackage}/share/com.github.Aylur.ags/types";
        recursive = true;
      };
      # "dotfiles/config/ags/types/gtk-session-lock" = {
      #   source = pkgs.callPackage ./pkgs/gtk-session-lock-types {inherit gtk-session-lock;};
      # };
    };
  };
  xdg = {
    enable = true;
    userDirs = {
      enable = true;
    };
  };
}
