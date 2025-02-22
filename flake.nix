{
  inputs = {
    # NixOS
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    home-manager.url = "github:nix-community/home-manager/release-24.11";

    # Programs
    yazi.url = "github:sxyazi/yazi/v0.3.1";

    # AGS/Astal (shell)
    astal.url = "github:aylur/astal";
    ags.url = "github:Aylur/ags/8eded03c8f943ee5cfdfb2e77f993b9f125811a5";
    gtk-session-lock.url = "github:Cu3PO42/gtk-session-lock";

    # Oblichey first needs to be fixed
    # oblichey.url = "path:/home/simon/GIT/Consuming/oblichey";
  };
  outputs = {nixpkgs, ...} @ inputs: {
    nixosConfigurations = {
      "TuxedoInfinityBook14Gen8" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [./nixos/machines/TuxedoInfinityBook14Gen8/system.nix];
      };
      "Workstation" = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        specialArgs.inputs = inputs;
        modules = [./nixos/machines/Workstation/system.nix];
      };
    };
  };
}
