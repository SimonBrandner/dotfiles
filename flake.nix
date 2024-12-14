{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    hyprland.url = "git+https://github.com/hyprwm/Hyprland?submodules=1";
    ags.url = "github:Aylur/ags/bb91f7c8fdd2f51c79d3af3f2881cacbdff19f60";
    home-manager.url = "github:nix-community/home-manager";
    gtk-session-lock.url = "github:Cu3PO42/gtk-session-lock";
    yazi.url = "github:sxyazi/yazi/v0.3.1";
    oblichey.url = "path:/home/simon/GIT/Consuming/oblichey";
    hy3 = {
      url = "github:outfoxxed/hy3";
      inputs.hyprland.follows = "hyprland";
    };
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
