# VOICEVOX CLI

CLI tool for VOICEVOX speech synthesis using TypeScript.

## 🚀 Features

- ⚡ Fast and lightweight CLI interface
- 🛠️ Development environment with Nix support
- 🐳 Docker Compose setup for VOICEVOX engine
- 🧪 Comprehensive test suite for API integration
- 📦 TypeScript with strict type checking

## 🚧 Planned Features (In Development)

- 🎤 Text-to-speech synthesis using VOICEVOX API
- 🗣️ Multiple speaker voices support
- 📁 Audio file output (WAV format)
- 🔊 Audio playback functionality

## 📋 Requirements

### With Nix (Recommended)

- [Nix](https://nixos.org/download.html) with flakes enabled
- [direnv](https://direnv.net/) (optional, for automatic environment loading)

### Without Nix

- Node.js 18.17 or higher
- npm

## 🛠️ Development Setup

### Using Nix (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd voicevox-cli
   ```

2. **Enter the development environment:**
   ```bash
   # Option 1: Manual activation
   nix develop

   # Option 2: With direnv (automatic)
   direnv allow  # First time only, then automatic on cd
   ```

3. **Start developing:**
   ```bash
   npm run dev -- --help
   ```

### Using npm directly

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start developing:**
   ```bash
   npm run dev -- --help
   ```

## 🎯 Current Usage

### Available Commands

```bash
# Show help
npm run dev -- --help

# Show version
npm run dev -- version

# Test speaker command (development)
npm run dev -- speakers

# Test speak command (development)
npm run dev -- speak "テスト"
```

> **Note**: The CLI is currently in development. The commands above show the interface but core functionality (actual speech synthesis) is not yet implemented.

## 🔧 Development Scripts

### Development
```bash
# Development mode
npm run dev

# Build the project
npm run build

# Start built version
npm start
```

### Testing
```bash
# Run tests (automatically starts/stops VOICEVOX engine)
npm test

# Run tests once (with auto Docker management)
npm run test:run

# Run integration tests with verbose output
npm run test:integration

# Run tests without Docker (skips integration tests)
npm run test:no-docker

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck

# Type checking in watch mode
npm run typecheck:watch
```

### Docker Operations
```bash
# Start VOICEVOX engine
npm run docker:up

# Start with Nginx proxy
npm run docker:up:proxy

# Stop VOICEVOX engine
npm run docker:down

# View logs
npm run docker:logs

# Check status
npm run docker:ps
```

## 🏗️ Nix Development Environments

This project provides multiple Nix development environments:

### Default Environment
```bash
nix develop
# or
nix develop .#default
```
Includes: Node.js, npm, TypeScript, audio libraries

### VOICEVOX Environment
```bash
nix develop .#voicevox
```
Includes: Everything from default + Python tools for VOICEVOX engine integration

## 🐳 VOICEVOX Engine Setup

To use this CLI, you need a running VOICEVOX engine. Choose one of the following methods:

### Method 1: Docker Compose (Recommended)

Use the included `docker-compose.yml` for easy setup:

```bash
# Start VOICEVOX engine
npm run docker:up

# Check if it's running
npm run docker:ps

# View logs
npm run docker:logs

# Stop the engine
npm run docker:down
```

**With Nginx proxy (for CORS handling):**
```bash
# Start with proxy
npm run docker:up:proxy

# Access VOICEVOX API via:
# - Direct: http://localhost:50021
# - Proxy: http://localhost:8080
```

### Method 2: Direct Docker

```bash
docker run --rm -p 50021:50021 voicevox/voicevox_engine:latest
```

### Method 3: VOICEVOX Desktop Application

1. Download VOICEVOX desktop application
2. Run it in server mode
3. Enable API server in settings

### Method 4: Build from Source

Follow [VOICEVOX Engine documentation](https://github.com/VOICEVOX/voicevox_engine)

### API Endpoints

The CLI expects the VOICEVOX API to be available at:
- **Default**: `http://localhost:50021`
- **With proxy**: `http://localhost:8080`

You can change the API URL using the `VOICEVOX_API_URL` environment variable.

## 📁 Project Structure

```
voicevox-cli/
├── src/
│   ├── index.ts                # Main CLI entry point
│   ├── voicevox-client.spec.ts # API integration tests
│   └── types/
│       └── ts-reset.d.ts       # TypeScript type improvements
├── docker-compose.yml          # VOICEVOX engine Docker setup
├── nginx.conf                  # Nginx proxy configuration
├── vitest.config.ts            # Test configuration
├── flake.nix                   # Nix development environment
├── .envrc                      # direnv configuration
├── package.json                # npm configuration
├── tsconfig.json               # TypeScript configuration
├── biome.json                  # Biome linter/formatter config
├── README.md                   # Project documentation
└── .husky/                     # Git hooks
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [VOICEVOX](https://voicevox.hiroshiba.jp/) - The amazing open-source text-to-speech software
- [cac](https://github.com/cacjs/cac) - Command-line framework
- [Nix](https://nixos.org/) - Reproducible development environments
