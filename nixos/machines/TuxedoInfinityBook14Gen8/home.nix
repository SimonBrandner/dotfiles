{config, ...}: {
  imports = [
    ../../home.nix
  ];
  xdg.userDirs.pictures = "/home/simon/BackUp/Pictures";
  home.file = {
    ".config/hypr/device.conf" = {
      source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/hypr/TuxedoInfinityBook14Gen8.conf";
    };
  };
}
