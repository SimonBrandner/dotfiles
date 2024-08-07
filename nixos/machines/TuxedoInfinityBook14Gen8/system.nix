{
  config,
  lib,
  pkgs,
  modulesPath,
  ...
}: {
  #disabledModules = [ "security/pam.nix" ];
  imports = [
    ../../system.nix
    (modulesPath + "/installer/scan/not-detected.nix")
    #"${inputs.nixpkgs-howdy}/nixos/modules/security/pam.nix"
    #"${inputs.nixpkgs-howdy}/nixos/modules/services/security/howdy"
    #"${inputs.nixpkgs-howdy}/nixos/modules/services/misc/linux-enable-ir-emitter.nix"
  ];
  nixpkgs = {
    overlays = [
      (final: prev: {
        megasync = pkgs.symlinkJoin {
          name = "megasync";
          paths = [prev.megasync];
          buildInputs = [pkgs.makeWrapper];
          postBuild = ''
            wrapProgram $out/bin/megasync --set QT_SCALE_FACTOR 1.75
          '';
        };
      })
    ];
    hostPlatform = lib.mkDefault "x86_64-linux";
  };
  powerManagement.cpuFreqGovernor = lib.mkDefault "powersave";
  home-manager.users.simon = import ./home.nix;
  networking = {
    hostName = "Simon-s-Tuxedo-InfinityBook-14-Gen8";
    useDHCP = lib.mkDefault true;
  };
  services = {
    tlp = {
      enable = true;
      settings = {
        DEVICES_TO_DISABLE_ON_STARTUP = "wwan";
        PLATFORM_PROFILE_ON_BAT = "low-power";
        CPU_MAX_PERF_ON_BAT = "80";
        RESTORE_DEVICE_STATE_ON_STARTUP = 1;
      };
    };
    #howdy = {
    #  enable = false;
    #  package = inputs.nixpkgs-howdy.legacyPackages.${pkgs.system}.howdy;
    #  settings = {
    #    video = {
    #      device_path = "/dev/video2";
    #      dark_threshold = 100;
    #    };
    #    core = {
    #      no_confirmation = true;
    #    };
    #  };
    #};
    #linux-enable-ir-emitter = {
    #  enable = true;
    #  package = inputs.nixpkgs-howdy.legacyPackages.${pkgs.system}.linux-enable-ir-emitter;
    #};
  };
  boot = {
    kernelModules = ["kvm-intel"];
    extraModulePackages = [];
    loader = {
      systemd-boot.enable = true;
      efi.canTouchEfiVariables = true;
      grub.device = "/dev/nvme0n1p3";
    };
    initrd = {
      availableKernelModules = ["xhci_pci" "thunderbolt" "nvme" "usb_storage" "sd_mod"];
      kernelModules = ["dm-snapshot"];
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
    tuxedo-rs = {
      enable = true;
      tailor-gui.enable = true;
    };
  };
  environment = {
    sessionVariables = {
      GDK_SCALE = "2";
      PRIMARY_MONITOR = "eDP-1";
    };
    systemPackages = with pkgs; [
      linuxKernel.packages.linux_6_8.tuxedo-keyboard
    ];
  };
}
