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
  };
}
