{ config, pkgs, inputs, lib, ... }: {
  imports = [
    inputs.ags.homeManagerModules.default
  ];
  programs = {
    ags = {
      enable = true;
      extraPackages = with pkgs; [
        gtksourceview
        webkitgtk
        accountsservice
      ];
    };
    home-manager.enable = true;
  };
  home = {
    username = "simon";
    homeDirectory = "/home/simon";
    stateVersion = "23.05";
    file = {
      ".zshrc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/scripts/zsh/zshrc";
      };
      ".config/hypr" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/hypr";
        recursive = true;
      };
      ".config/ags" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/ags";
        recursive = true;
      };
      ".config/mc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/mc";
        recursive = true;
      };
      ".config/swappy" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/swappy";
        recursive = true;
      };
      ".config/Kvantum" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/Kvantum";
        recursive = true;
      };
      ".local/share/krusader" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/local/share/krusader";
        recursive = true;
      };
    };
  };
}
