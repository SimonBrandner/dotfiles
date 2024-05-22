{
  config,
  lib,
  modulesPath,
  ...
}: {
  imports = [
    ../../system.nix
    (modulesPath + "/installer/scan/not-detected.nix")
  ];
  home-manager.users.simon = import ./home.nix;
  services.xserver.videoDrivers = ["nvidia"];
  networking.useDHCP = lib.mkDefault true;
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
  boot = {
    kernelModules = ["kvm-amd"];
    extraModulePackages = [];
    loader = {
      systemd-boot.enable = true;
      efi.canTouchEfiVariables = true;
      grub.device = "/dev/nvme0n1p3";
    };
    initrd = {
      availableKernelModules = ["nvme" "xhci_pci" "ahci" "usb_storage" "usbhid" "sd_mod" "sr_mod"];
      kernelModules = ["dm-snapshot"];
      luks.devices = {
        root = {
          device = "/dev/nvme0n1p3";
          preLVM = true;
        };
      };
    };
  };
  hardware = {
    cpu.amd.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
    nvidia = {
      modesetting.enable = true;
      nvidiaSettings = true;
      package = config.boot.kernelPackages.nvidiaPackages.mkDriver {
        version = "555.42.02";
        sha256_64bit = "sha256-k7cI3ZDlKp4mT46jMkLaIrc2YUx1lh1wj/J4SVSHWyk=";
        sha256_aarch64 = lib.fakeSha256;
        openSha256 = "sha256-rtDxQjClJ+gyrCLvdZlT56YyHQ4sbaL+d5tL4L4VfkA=";
        settingsSha256 = "sha256-rtDxQjClJ+gyrCLvdZlT56YyHQ4sbaL+d5tL4L4VfkA=";
        persistencedSha256 = lib.fakeSha256;
      };
    };
  };
  fileSystems = {
    "/boot" = {
      device = "/dev/disk/by-uuid/D85D-1EE5";
      fsType = "vfat";
      options = ["fmask=0022" "dmask=0022"];
    };
    "/" = {
      device = "/dev/disk/by-uuid/a45bfffd-98ea-4d1b-877d-7cfe62a3259d";
      fsType = "ext4";
    };
    "/home/simon/Data1" = {
      device = "/dev/disk/by-uuid/df8dc44e-ced5-4161-9878-96b26812823c";
      fsType = "ext4";
    };
    "/home/simon/Data2" = {
      device = "/dev/disk/by-uuid/79d6235d-caa4-4ce9-9378-cadd70f1b7f5";
      fsType = "ext4";
    };
    "/home/simon/Data3" = {
      device = "/dev/disk/by-uuid/d0e75d3f-01b5-41b9-9ad0-e7363e4704af";
      fsType = "ext4";
    };
  };
  swapDevices = [
    {device = "/dev/disk/by-uuid/dda3bd3a-3634-47a0-94d2-f469aa2f75fb";}
  ];
  environment.sessionVariables = {
    PRIMARY_MONITOR = "HDMI-A-1";
  };
}
