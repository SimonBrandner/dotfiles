{
  config,
  pkgs,
  inputs,
  lib,
  ...
}: let
  yazi-plugins = (
    lib.concatMapAttrs (n: v: {
      ".config/yazi/plugins/${n}.yazi".source = v;
    }) {
      inherit (pkgs.yaziPlugins) mount;
      inherit (pkgs.yaziPlugins) full-border;
      inherit (pkgs.yaziPlugins) smart-enter;
      inherit (pkgs.yaziPlugins) smart-filter;
      inherit (pkgs.yaziPlugins) git;
    }
  );
in {
  imports = [
    inputs.ags.homeManagerModules.default
  ];
  programs = {
    home-manager.enable = true;
    ags = {
      enable = true;
      extraPackages = with pkgs; [
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.wireplumber
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.notifd
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.battery
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.bluetooth
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.apps
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.auth
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.hyprland
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.mpris
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.network
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.tray
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.io
        inputs.ags.packages.${pkgs.stdenv.hostPlatform.system}.astal3
        fzf
        gtksourceview
        accountsservice
      ];
    };
    zsh = {
      enable = true;
      dotDir = config.home.homeDirectory;
      syntaxHighlighting.enable = true;
      initContent = ''
        [[ ! -f ${../scripts/zsh/main.zsh} ]] || source ${../scripts/zsh/main.zsh}
        source ${pkgs.zsh-powerlevel10k}/share/zsh-powerlevel10k/powerlevel10k.zsh-theme
        source ${
          pkgs.zsh-autosuggestions
        }/share/zsh-autosuggestions/zsh-autosuggestions.zsh
      '';
    };
  };
  gtk = let
    theme = {
      package = pkgs.kdePackages.breeze-gtk;
      name = "Breeze-Dark";
    };
  in {
    enable = true;
    theme = theme;
    gtk4.theme = theme;
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
    file =
      {
        ".local/bin/start-ags" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/scripts/start-ags.zsh";
        };
        ".local/bin/add-project" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/scripts/projects/add-project.py";
        };
        ".local/bin/open-project" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/scripts/projects/open-project.py";
        };
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
        ".config/yazi/keymap.toml" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/yazi/keymap.toml";
        };
        ".config/yazi/theme.toml" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/yazi/theme.toml";
        };
        ".config/yazi/init.lua" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/yazi/init.lua";
        };
        ".config/yazi/yazi.toml" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/yazi/yazi.toml";
        };
        ".config/cliphist" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/cliphist";
          recursive = true;
        };
        ".config/niri" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/niri";
          recursive = true;
        };
        ".config/mc" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/mc";
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
        ".config/qt6ct" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/qt6ct";
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
        ".config/codebook" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/codebook";
          recursive = true;
        };
        ".config/harper-ls" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/harper-ls";
          recursive = true;
        };
        ".config/btop" = {
          source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/btop";
          recursive = true;
        };
        "dotfiles/config/ags/types" = {
          source = "${config.programs.ags.finalPackage}/share/com.github.Aylur.ags/types";
          recursive = true;
        };
      }
      // yazi-plugins;
  };
  xdg = {
    enable = true;
    userDirs = {
      enable = true;
      setSessionVariables = true;
    };
  };
}
