{
  description = "Asceta";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-25.11-darwin";
  };

  outputs = { nixpkgs, ... }:
  let
    system = "aarch64-darwin";

    mkPkgs = nixpkgsInput: import nixpkgsInput {
      inherit system;
    };

    pkgs = mkPkgs nixpkgs;
  in
  {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs
        docker-compose
        pnpm
      ];

      shellHook = ''
        echo "✅ Dev shell loaded for ${system}"
      '';
    };
  };
}
