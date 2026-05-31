{
  inputs = {
    # NixOS
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    nixpkgs-megasync.url = "github:NixOS/nixpkgs/c7f47036d3df2add644c46d712d14262b7d86c0c";
    home-manager.url = "github:nix-community/home-manager/release-26.05";

    # AGS/Astal (shell)
    astal.url = "github:aylur/astal";
    ags.url = "github:Aylur/ags/v3.1.2";

    # Oblichey first needs to be fixed
    # oblichey.url = "path:/home/simon/GIT/Consuming/oblichey";
  };
  outputs = {
    nixpkgs,
    nixpkgs-megasync,
    ...
  } @ inputs: {
    nixosConfigurations = let
      system = "x86_64-linux";
      specialArguments = {
        inputs = inputs;
        pkgs-megasync = import nixpkgs-megasync {
          inherit system;
          config.allowUnfree = true;
        };
      };
    in {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = system;
        specialArgs = specialArguments;
        modules = [./nixos/machines/TuxedoInfinityBook14Gen8/system.nix];
      };
      "Workstation" = nixpkgs.lib.nixosSystem {
        system = system;
        specialArgs = specialArguments;
        modules = [./nixos/machines/Workstation/system.nix];
      };
    };
  };
}
