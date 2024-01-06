{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
    nixpkgs-howdy.url = "github:fufexan/nixpkgs/howdy";
  };
  outputs = { nixpkgs, ... }@inputs: {
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
