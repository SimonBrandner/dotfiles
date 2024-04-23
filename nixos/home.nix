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
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/scripts/zsh/zshrc";
      };
      ".config/kdeglobals" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/kdeglobals";
      };
      ".config/hypr" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/hypr";
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
      ".config/qt5ct" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/qt5ct";
        recursive = true;
      };
      ".local/share/krusader" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/local/share/krusader";
        recursive = true;
      };
      ".config/ags" = {
        source = config.lib.file.mkOutOfStoreSymlink "/home/simon/Data1/GIT/Other/dotfiles/config/ags";
        recursive = true;
      };
      "/home/simon/Data1/GIT/Other/dotfiles/config/ags/types" = {
        source =
          "${config.programs.ags.finalPackage}/share/com.github.Aylur.ags/types";
        recursive = true;
      };
      "/home/simon/Data1/GIT/Other/dotfiles/config/ags/types/gtk-session-lock" = {
        source = pkgs.callPackage ./pkgs/gtk-session-lock-types { inherit gtk-session-lock; };
      };
    };
  };
}
