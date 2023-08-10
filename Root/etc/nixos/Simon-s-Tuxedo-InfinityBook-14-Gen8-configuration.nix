{ config, lib, pkgs, modulesPath, ... }:

let
  tuxedo = import (builtins.fetchTarball "https://github.com/blitz/tuxedo-nixos/archive/master.tar.gz");
  nixpkgs-howdy = builtins.getFlake "github:fufexan/nixpkgs/howdy";
in {
  imports = [
    (modulesPath + "/installer/scan/not-detected.nix")
    tuxedo.module
    "${nixpkgs-howdy}/nixos/modules/security/pam.nix"
    "${nixpkgs-howdy}/nixos/modules/services/misc/linux-enable-ir-emitter.nix"
    "${nixpkgs-howdy}/nixos/modules/services/security/howdy"
  ];
  disabledModules = ["security/pam.nix"];
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
  powerManagement.cpuFreqGovernor = lib.mkDefault "powersave";
  networking = {
    hostName = "Simon-s-Tuxedo-InfinityBook-14-Gen8";
    useDHCP = lib.mkDefault true;
  };
  services = {
    howdy = {
      enable = true;
      package = nixpkgs-howdy.legacyPackages.${pkgs.system}.howdy;
      settings = {
        video = {
          device_path = "/dev/video2";
          dark_threshold = 90;
        };
        core = {
          no_confirmation = true;
        };
      };
    };
    linux-enable-ir-emitter = {
      enable = true;
      package = nixpkgs-howdy.legacyPackages.${pkgs.system}.linux-enable-ir-emitter;
    };
  };
  boot = {
    kernelModules = [ "kvm-intel" ];
    extraModulePackages = [ ];
    loader = {
      systemd-boot.enable = true;
      efi.canTouchEfiVariables = true;
      grub.device = "/dev/nvme0n1p3";
    };
    initrd = {
      availableKernelModules = [ "xhci_pci" "thunderbolt" "nvme" "usb_storage" "sd_mod" ];
      kernelModules = [ "dm-snapshot" ];
      luks.devices = {
        root = {
          device = "/dev/nvme0n1p3";
          preLVM = true;
        };
      };
    };
  };
  fileSystems = {
    "/" = {
      device = "/dev/disk/by-uuid/6174d346-1452-4857-8b0d-eaee1defbafc";
      fsType = "ext4";
    };
    "/boot" = {
      device = "/dev/disk/by-uuid/0CFC-5D72";
      fsType = "vfat";
    };
  };
  swapDevices = [
    {
      device = "/dev/disk/by-uuid/b3696acf-3091-4f60-a0a2-53cd29ae0c0f"; 
    }
  ];
  hardware = {
    cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
    tuxedo-control-center.enable = true;
  };
  environment.systemPackages = with pkgs; [
  	linuxKernel.packages.linux_6_1.tuxedo-keyboard
  ];
}
