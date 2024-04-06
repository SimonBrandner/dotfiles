{ inputs, pkgs, ... }: {
  programs.home-manager.enable = true;
  home = {
    username = "simon";
    homeDirectory = "/home/simon";
    stateVersion = "23.05";
  };
}
