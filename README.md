# Atomic Settlement

A decentralized atomic settlement platform built with React, TypeScript, Hardhat, and MongoDB.

## Features

- 🔐 **Trustless Atomic Settlements** - Smart contract-based escrow with instant refunds
- 🌐 **Multi-Chain Support** - Ethereum Sepolia testnet and local Hardhat network
- 💰 **Web3 Integration** - MetaMask, WalletConnect, and RainbowKit wallet support
- 📊 **Real-time Pipeline** - Live transaction status monitoring
- 🎛️ **Developer Controls** - Simulate different settlement scenarios
- 💾 **MongoDB Storage** - Persistent simulation state storage

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- MetaMask or compatible Web3 wallet

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Server
# Windows: https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow official MongoDB installation guide

# Start MongoDB service
mongod

# Or with brew on macOS:
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string from the Atlas dashboard

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `MONGODB_URL` - Your MongoDB connection string
- `PRIVATE_KEY` - Private key for contract interactions (optional for development)

### 4. Smart Contract Deployment

#### Option A: Using Ganache (Recommended for Development)

```bash
# Start Ganache blockchain (in one terminal)
# Make sure Ganache CLI is installed: npm install -g ganache
./scripts/start-ganache.bat

# Deploy contracts to Ganache (in another terminal)
npx hardhat run scripts/deploy.ts --network ganache

# Update CONTRACT_ADDRESS in client/src/lib/contract.ts with the deployed address
```

#### Option B: Using Local Hardhat Network

```bash
# Start local Hardhat network
npx hardhat node

# Deploy contracts (in another terminal)
npx hardhat run scripts/deploy.ts --network localhost

# Update CONTRACT_ADDRESS in client/src/lib/contract.ts with deployed address
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## MetaMask Configuration

### For Ganache Development

1. Open MetaMask and click the network dropdown
2. Click "Add Network"
3. Fill in the following details:
   - **Network Name**: Ganache
   - **New RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: (leave blank)

4. Import Ganache accounts to MetaMask:
   - Click your account icon → "Import Account"
   - Enter private keys from Ganache console output
   - Or use the pre-configured accounts in `hardhat.config.ts`

### For Sepolia Testnet

The app also supports Sepolia testnet. Make sure you have test ETH from a faucet.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and Web3 config
│   │   └── store/         # Zustand state management
├── server/                 # Express backend
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # MongoDB storage layer
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment and utility scripts
└── shared/                # Shared types and schemas
```

## Quick Start with Ganache

```bash
# One-command setup (installs Ganache CLI if needed)
npm run setup-ganache

# Start Ganache blockchain
npm run start-ganache

# Deploy contracts (in another terminal)
npm run deploy-ganache

# Update CONTRACT_ADDRESS in client/src/lib/contract.ts with deployed address

# Start the development server
npm run dev
```

## Manual Setup

npm run setup

# Test MongoDB connection

npm run test-db

# Start development server

npm run dev

````

## Usage

1. **Connect Wallet** - Click "CONNECT WALLET" to link your Web3 wallet
2. **Initiate Payment** - Enter payment details and lock funds in escrow
3. **Monitor Pipeline** - Watch real-time transaction status
4. **Simulate Scenarios** - Use developer controls to test different outcomes
5. **Settlement** - Oracle verifies and executes settlement or refund

## Development

```bash
# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start
````

## Testing

```bash
# Run smart contract tests
npx hardhat test

# Run with coverage
npx hardhat coverage
```
