{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-howdy.url = "github:fufexan/nixpkgs/6c4d8308df71d57f5a56f3037867355a3858be33";
    hyprland.url = "github:hyprwm/Hyprland";
  };
  outputs = { nixpkgs, hyprland, ... }@inputs: {
    nixosConfigurations = {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          hyprland.nixosModules.default
          ./global.nix
          ./TuxedoInfinityBook14Gen8.nix
        ];
      };
      "ThinkpadT430S" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          hyprland.nixosModules.default
          ./global.nix
          ./ThinkpadT430S.nix
        ];
      };
    };
  };
}
