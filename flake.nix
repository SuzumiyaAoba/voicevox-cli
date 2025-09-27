{
  description = "VOICEVOX CLI development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        lib = pkgs.lib;
        stdenv = pkgs.stdenv;
        
        # Node.js version to use
        nodejs = pkgs.nodejs_20;
        
        # Development tools
        devTools = with pkgs; [
          # Node.js (includes npm)
          nodejs
          
          # TypeScript and development tools
          typescript
          
          # Audio libraries for VOICEVOX (cross-platform)
          ffmpeg
          sox
          
          # System utilities
          curl
          wget
          jq
          
          # Git and development utilities
          git
          gnumake
        ] ++ lib.optionals stdenv.isLinux [
          # Linux-specific audio libraries
          alsa-lib
          pulseaudio
        ];
        
        # Shell hooks for environment setup
        shellHook = ''
          echo "🎤 VOICEVOX CLI Development Environment"
          echo "Node.js version: $(node --version)"
          echo "npm version: $(npm --version)"
          echo ""
          echo "Available commands:"
          echo "  npm run dev        - Run in development mode"
          echo "  npm run build      - Build the project"
          echo "  npm run lint       - Run linter"
          echo "  npm test           - Run tests"
          echo ""
          
          # Set up npm environment
          export NPM_CONFIG_PREFIX="$PWD/.npm-global"
          export PATH="$NPM_CONFIG_PREFIX/bin:$PATH"
          mkdir -p .npm-global
          
          
          # Platform-specific audio setup
          ${lib.optionalString stdenv.isLinux ''
            # Linux audio environment
            export PULSE_RUNTIME_PATH="${pkgs.pulseaudio}/lib/pulseaudio"
            echo "Linux audio libraries configured"
          ''}
          ${lib.optionalString stdenv.isDarwin ''
            # macOS audio environment
            echo "Using macOS native audio frameworks"
          ''}
          
          # Install dependencies if needed
          if [ ! -d "node_modules" ]; then
            echo "Installing npm dependencies..."
            npm install
          fi
        '';
        
      in {
        # Default development shell
        devShells.default = pkgs.mkShell {
          buildInputs = devTools;
          inherit shellHook;
          
          # Environment variables
          VOICEVOX_API_URL = "http://localhost:50021";
          NODE_ENV = "development";
        };
        
        # Alternative shell with VOICEVOX engine
        devShells.voicevox = pkgs.mkShell {
          buildInputs = devTools ++ (with pkgs; [
            # Additional tools for VOICEVOX engine
            python3
            python3Packages.pip
            python3Packages.requests
          ]);
          
          shellHook = shellHook + ''
            echo "🤖 VOICEVOX engine environment included"
            echo "VOICEVOX API URL: $VOICEVOX_API_URL"
            echo ""
            echo "To start VOICEVOX engine:"
            echo "  # Download and run VOICEVOX engine separately"
            echo "  # or use Docker: docker run --rm -p 50021:50021 voicevox/voicevox_engine:latest"
          '';
          
          VOICEVOX_API_URL = "http://localhost:50021";
          NODE_ENV = "development";
        };
        
        # Package definition for the CLI
        packages.default = pkgs.buildNpmPackage {
          pname = "voicevox-cli";
          version = "0.1.0";
          
          src = ./.;
          
          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; # This will need to be updated
          
          buildInputs = with pkgs; [
            nodejs
          ] ++ lib.optionals stdenv.isLinux [
            alsa-lib
            pulseaudio
          ];
          
          meta = with pkgs.lib; {
            description = "CLI tool for VOICEVOX speech synthesis";
            homepage = "https://github.com/SuzumiyaAoba/voicevox-cli";
            license = licenses.mit;
            maintainers = [ ];
            platforms = platforms.unix;
          };
        };
      });
}
