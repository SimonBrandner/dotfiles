{ pkgs, inputs, lib, ... }: {
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
      ".zshrc".source = ../scripts/zsh/zshrc;
      ".config/hypr/hyprland.conf".source = ../config/hypr/hyprland.conf;
      ".config/hypr/hyprlock.conf".source = ../config/hypr/hyprlock.conf;
      ".config/mc" = {
        source = ../config/mc;
        recursive = true;
      };
      ".config/ags" = {
        source = ../config/ags;
        recursive = true;
      };
      ".local/share/krusader" = {
        source = ../local/share/krusader;
        recursive = true;
      };
    };
  };
}
