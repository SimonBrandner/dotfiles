{ pkgs, inputs, ... }: {
  imports = [ inputs.ags.homeManagerModules.default ];
  programs = {
    ags = {
      enable = true;
      configDir = ../../../.config/ags;
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
  };
}
