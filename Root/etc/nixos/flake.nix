{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-howdy.url = "github:fufexan/nixpkgs/6c4d8308df71d57f5a56f3037867355a3858be33";
    hyprland.url = "github:hyprwm/Hyprland";
    hypridle.url = "github:hyprwm/hypridle";
    ags.url = "github:Aylur/ags";
    home-manager.url = "github:nix-community/home-manager/release-23.11";
  };
  outputs = { nixpkgs, hyprland, ... }@inputs: {
    nixosConfigurations = {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          ./global.nix
          ./TuxedoInfinityBook14Gen8.nix
        ];
      };
      "ThinkpadT430S" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          ./global.nix
          ./ThinkpadT430S.nix
        ];
      };
    };
  };
}
