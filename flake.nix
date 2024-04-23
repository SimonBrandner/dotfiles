{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-howdy.url = "github:fufexan/nixpkgs/6c4d8308df71d57f5a56f3037867355a3858be33";
    hyprland.url = "github:hyprwm/Hyprland";
    hyprlock.url = "github:hyprwm/Hyprlock";
    hypridle.url = "github:hyprwm/Hypridle";
    hyprcursor.url = "github:hyprwm/Hyprcursor";
    ags.url = "github:Aylur/ags";
    home-manager.url = "github:nix-community/home-manager/release-23.11";
    gtk-session-lock.url = "github:Cu3PO42/gtk-session-lock";
  };
  outputs = { nixpkgs, hyprland, ... }@inputs: {
    nixosConfigurations = {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [
          ./nixos/global.nix
          ./nixos/machines/TuxedoInfinityBook14Gen8.nix
        ];
      };
    };
  };
}
