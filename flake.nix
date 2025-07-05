{
  inputs = {
    # NixOS
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    home-manager.url = "github:nix-community/home-manager/release-25.05";

    # Programs
    yazi.url = "github:sxyazi/yazi/v25.4.8";

    # AGS/Astal (shell)
    astal.url = "github:aylur/astal";
    ags.url = "github:Aylur/ags/v2.3.0";
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
