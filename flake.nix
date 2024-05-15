{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-howdy.url = "github:fufexan/nixpkgs/6c4d8308df71d57f5a56f3037867355a3858be33";
    hyprland.url = "git+https://github.com/hyprwm/Hyprland?submodules=1";
    ags.url = "github:Aylur/ags";
    home-manager.url = "github:nix-community/home-manager";
    gtk-session-lock.url = "github:Cu3PO42/gtk-session-lock";
  };
  outputs = { nixpkgs, hyprland, ... }@inputs: {
    nixosConfigurations = {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          ./nixos/system.nix
          ./nixos/machines/TuxedoInfinityBook14Gen8/system.nix
        ];
      };
    };
  };
}
