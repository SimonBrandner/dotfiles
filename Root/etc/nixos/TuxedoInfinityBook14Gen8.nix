{ config, lib, pkgs, modulesPath, inputs, ... }: {
  disabledModules = ["security/pam.nix"];
  imports = [
    (modulesPath + "/installer/scan/not-detected.nix")
    "${inputs.nixpkgs-howdy}/nixos/modules/security/pam.nix"
    "${inputs.nixpkgs-howdy}/nixos/modules/services/security/howdy"
    "${inputs.nixpkgs-howdy}/nixos/modules/services/misc/linux-enable-ir-emitter.nix"
  ];
  nixpkgs = {
    hostPlatform = lib.mkDefault "x86_64-linux";
    overlays = [
      (final: prev: {
        tuxedo-rs = prev.tuxedo-rs.overrideAttrs (old: rec {
          src = prev.fetchFromGitHub {
            owner = "SimonBrandner";
            repo = "tuxedo-rs";
            rev = "c00f70e9e8ed9a746d79cea1c1e845db2757530b";
            hash = "sha256-AZaVMYqnxzQJppFHeeyuVN6rM/et21chWbo3FBOU8AM=";
          };
          cargoDeps = old.cargoDeps.overrideAttrs (prev.lib.const {
            inherit src;
            name = "tuxedo-rs-vendor.tar.gz";
            outputHash = "sha256-aD9hNgaBl52VAw+l2HsBG11Rk7T6V4yO1C4oNDiCPAA=";
          });
        });
        tailor-gui = prev.tailor-gui.overrideAttrs (old: rec {
          src = prev.fetchFromGitHub {
            owner = "SimonBrandner";
            repo = "tuxedo-rs";
            rev = "c00f70e9e8ed9a746d79cea1c1e845db2757530b";
            hash = "sha256-AZaVMYqnxzQJppFHeeyuVN6rM/et21chWbo3FBOU8AM=";
          };
          cargoDeps = old.cargoDeps.overrideAttrs (prev.lib.const {
            inherit src;
            name = "tailor-gui-vendor.tar.gz";
            outputHash = "sha256-fxrm4QHC1KSHdQfwiP/JYmUgUdWJwtGYCR8sV5+8gv0=";
          });
        });
      })
    ];
  };
  powerManagement.cpuFreqGovernor = lib.mkDefault "powersave";
  networking = {
    hostName = "Simon-s-Tuxedo-InfinityBook-14-Gen8";
    useDHCP = lib.mkDefault true;
  };
  services = {
    howdy = {
      enable = true;
      package = inputs.nixpkgs-howdy.legacyPackages.${pkgs.system}.howdy;
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
      package = inputs.nixpkgs-howdy.legacyPackages.${pkgs.system}.linux-enable-ir-emitter;
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
    tuxedo-rs = {
      enable = true;
      tailor-gui.enable = true;
    };
  };
  environment.systemPackages = with pkgs; [
  	linuxKernel.packages.linux_6_6.tuxedo-keyboard
  ];
}
