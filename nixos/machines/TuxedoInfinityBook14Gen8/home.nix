{ config, ... }: {
  imports = [
    ../../home.nix
  ];
  home.file = {
    ".config/hypr/device.conf" = {
      source = config.lib.file.mkOutOfStoreSymlink "/home/simon/dotfiles/config/hypr/TuxedoInfinityBook14Gen8.conf";
    };
  };
}
