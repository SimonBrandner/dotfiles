{config, ...}: {
  imports = [
    ../../home.nix
  ];
  xdg.userDirs.pictures = "/home/simon/Data1/BackUp/Pictures";
  home.file = {
    ".config/hypr/device.conf" = {
      source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/hypr/Workstation.conf";
    };
  };
}
