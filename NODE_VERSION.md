# Node.js Version Requirement

This project requires **Node.js >= 20.9.0** to use Next.js 16.

## Current Status
- Current Node.js version: v18.20.7
- Required Node.js version: >= 20.9.0
- Next.js version: 16.1.1

## How to Update Node.js

### Option 1: Using NVM (Node Version Manager) - Recommended
If you have NVM installed:
```bash
nvm install 20.9.0
nvm use 20.9.0
```

Or use the latest LTS:
```bash
nvm install --lts
nvm use --lts
```

### Option 2: Download from Node.js Website
1. Visit https://nodejs.org/
2. Download Node.js 20.x LTS or later
3. Install and restart your terminal

### Option 3: Using Chocolatey (Windows)
```powershell
choco install nodejs-lts
```

## Verify Installation
After updating, verify with:
```bash
node --version
```

You should see v20.9.0 or higher.

## After Updating Node.js
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` to reinstall dependencies with the correct Node.js version
