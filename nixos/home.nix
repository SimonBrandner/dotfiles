{ config, pkgs, inputs, lib, ... }:
let
  gtk-session-lock = inputs.gtk-session-lock.packages.${pkgs.system}.default;
in
{
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
        gtk-session-lock
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
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/scripts/zsh/zshrc";
      };
      ".local/share/krusader" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/local/share/krusader";
        recursive = true;
      };
      ".config/kdeglobals" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/kdeglobals";
      };
      ".config/hypr" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/hypr";
        recursive = true;
      };
      ".config/mc" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/mc";
        recursive = true;
      };
      ".config/swappy" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/swappy";
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
      ".config/ags" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/ags";
        recursive = true;
      };
      "/home/simon/dotfiles/config/ags/types" = {
        source =
          "${config.programs.ags.finalPackage}/share/com.github.Aylur.ags/types";
        recursive = true;
      };
      "/home/simon/dotfiles/config/ags/types/gtk-session-lock" = {
        source = pkgs.callPackage ./pkgs/gtk-session-lock-types { inherit gtk-session-lock; };
      };
    };
  };
}
