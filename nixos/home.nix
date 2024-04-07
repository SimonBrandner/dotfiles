{ config, pkgs, inputs, lib, ... }: {
  imports = [
    inputs.ags.homeManagerModules.default
    inputs.hypridle.homeManagerModules.default
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
  services = {
    hypridle = {
      enable = true;
      lockCmd = lib.getExe pkgs.unstable.hyprlock;
      beforeSleepCmd = lib.getExe pkgs.unstable.hyprlock;
    };
  };
  home = {
    username = "simon";
    homeDirectory = "/home/simon";
    stateVersion = "23.05";
    file = {
      ".zshrc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/scripts/zsh/zshrc";
      };
      ".config/hypr/hyprland.conf" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/hypr/hyprland.conf";
      };
      ".config/hypr/hyprlock.conf" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/hypr/hyprlock.conf";
      };
      ".config/ags" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/ags";
        recursive = true;
      };
      ".config/mc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/mc";
        recursive = true;
      };
      ".local/share/krusader" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/local/share/krusader";
        recursive = true;
      };
    };
  };
}
