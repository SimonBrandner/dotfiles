# Do not modify this file!  It was generated by ‘nixos-generate-config’
# and may be overwritten by future invocations.  Please make changes
# to /etc/nixos/configuration.nix instead.
{ config, lib, pkgs, modulesPath, ... }:

let
  tuxedo = import (builtins.fetchTarball "https://github.com/blitz/tuxedo-nixos/archive/master.tar.gz");
in {
  imports = [ 
    (modulesPath + "/installer/scan/not-detected.nix")
    tuxedo.module
  ];

  # Networking
  networking.hostName = "simon-s-tuxedo-infinity-book-14-gen8";
  networking.useDHCP = lib.mkDefault true;

  # Boot
  boot.kernelModules = [ "kvm-intel" ];
  boot.extraModulePackages = [ ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.grub.device = "/dev/nvme0n1p3";

  boot.initrd.availableKernelModules = [ "xhci_pci" "thunderbolt" "nvme" "usb_storage" "sd_mod" ];
  boot.initrd.kernelModules = [ "dm-snapshot" ];
  boot.initrd.luks.devices = {
    root = {
      device = "/dev/nvme0n1p3";
      preLVM = true;
    };
  };

  # File systems
  fileSystems."/" = {
    device = "/dev/disk/by-uuid/6174d346-1452-4857-8b0d-eaee1defbafc";
    fsType = "ext4";
  };
  fileSystems."/boot" = {
    device = "/dev/disk/by-uuid/0CFC-5D72";
    fsType = "vfat";
  };

  # Swap
  swapDevices = [
    {
      device = "/dev/disk/by-uuid/b3696acf-3091-4f60-a0a2-53cd29ae0c0f"; 
    }
  ];

  # Host platform
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";

  # Power management
  powerManagement.cpuFreqGovernor = lib.mkDefault "powersave";

  # Hardware
  hardware.cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
  hardware.tuxedo-control-center.enable = true;

  # System packages
  environment.systemPackages = with pkgs; [
  	tor-browser-bundle-bin
  	linuxKernel.packages.linux_6_1.tuxedo-keyboard
  ];
}
