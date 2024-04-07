{ pkgs, inputs, ... }: {
  imports = [ inputs.ags.homeManagerModules.default ];
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
  };
}
