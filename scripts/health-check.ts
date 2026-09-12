import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import http from 'http';
import https from 'https';

// Load environment variables from .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

interface EnvCheckItem {
  key: string;
  category: 'AI & Epistemic Engines' | 'API Gateway & Security' | 'Firebase & Persistence' | 'Runtime & Network';
  requiredForStartup: boolean;
  defaultValue?: string;
  description: string;
  troubleshootingTip: string;
}

const ENV_SPECS: EnvCheckItem[] = [
  // 1. Runtime & Network
  {
    key: 'PORT',
    category: 'Runtime & Network',
    requiredForStartup: true,
    defaultValue: '3000',
    description: 'HTTP & WebSocket port for the container reverse proxy',
    troubleshootingTip: 'Ensure PORT is set to 3000 (hardcoded container constraint).'
  },
  {
    key: 'NODE_ENV',
    category: 'Runtime & Network',
    requiredForStartup: false,
    defaultValue: 'development',
    description: 'Current execution environment mode',
    troubleshootingTip: 'Set to development for live dev server, or production for container builds.'
  },
  {
    key: 'DISABLE_HMR',
    category: 'Runtime & Network',
    requiredForStartup: false,
    defaultValue: 'true',
    description: 'Controls Vite HMR in AI Studio sandboxed preview',
    troubleshootingTip: 'Keep set to true in AI Studio container to avoid preview flicker.'
  },

  // 2. AI & Epistemic Engines
  {
    key: 'GEMINI_API_KEY',
    category: 'AI & Epistemic Engines',
    requiredForStartup: false,
    defaultValue: undefined,
    description: 'Google Generative AI API key for server-side epistemic synthesis',
    troubleshootingTip: 'Set via AI Studio Settings or .env to enable live Gemini 3.8 Flash models.'
  },
  {
    key: 'GEMINI_MODEL',
    category: 'AI & Epistemic Engines',
    requiredForStartup: false,
    defaultValue: 'gemini-3.8-flash',
    description: 'Active Google Gemini multimodal model alias',
    troubleshootingTip: 'Defaults to gemini-3.8-flash (recommended for high throughput and low latency).'
  },

  // 3. API Gateway & Security
  {
    key: 'ATLAS_API_KEY',
    category: 'API Gateway & Security',
    requiredForStartup: false,
    defaultValue: 'atlas_live_sec_992619843911_eugeneochako48',
    description: 'Epistemic API Gateway authentication token',
    troubleshootingTip: 'Provide a strong developer key to protect private telemetry endpoints.'
  },
  {
    key: 'JWT_SECRET',
    category: 'API Gateway & Security',
    requiredForStartup: false,
    defaultValue: 'atlas_sanctum_super_secure_jwt_signing_token_min_32_chars',
    description: 'Symmetric signing secret for session tokens and signed proof manifests',
    troubleshootingTip: 'Provide a secret string at least 32 characters in length.'
  },

  // 4. Firebase & Persistence
  {
    key: 'FIREBASE_PROJECT_ID',
    category: 'Firebase & Persistence',
    requiredForStartup: false,
    defaultValue: 'gen-lang-client-0309966576',
    description: 'Google Cloud / Firebase Project identifier',
    troubleshootingTip: 'Synchronize with firebase-applet-config.json projectId.'
  },
  {
    key: 'FIRESTORE_DATABASE_ID',
    category: 'Firebase & Persistence',
    requiredForStartup: false,
    defaultValue: 'ai-studio-atlassanctum-057b8dc9-f704-4eef-9433-c582431b22c7',
    description: 'Firestore Database instance name',
    troubleshootingTip: 'Ensure database ID matches the provisioned Firestore instance.'
  }
];

// Network Probe Helpers
async function checkDns(hostname: string): Promise<boolean> {
  try {
    await dns.promises.lookup(hostname);
    return true;
  } catch {
    return false;
  }
}

async function checkHttps(urlStr: string, timeoutMs = 2500): Promise<{ ok: boolean; status?: number; latencyMs: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    try {
      const req = https.get(urlStr, { timeout: timeoutMs }, (res) => {
        resolve({ ok: true, status: res.statusCode, latencyMs: Date.now() - start });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, latencyMs: Date.now() - start });
      });
      req.on('error', () => {
        resolve({ ok: false, latencyMs: Date.now() - start });
      });
    } catch {
      resolve({ ok: false, latencyMs: Date.now() - start });
    }
  });
}

async function checkLocalServer(port: number, timeoutMs = 1500): Promise<{ ok: boolean; status?: number }> {
  return new Promise((resolve) => {
    try {
      const req = http.get(`http://localhost:${port}/api/health`, { timeout: timeoutMs }, (res) => {
        resolve({ ok: res.statusCode === 200, status: res.statusCode });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false });
      });
      req.on('error', () => {
        resolve({ ok: false });
      });
    } catch {
      resolve({ ok: false });
    }
  });
}

async function runHealthCheck(): Promise<boolean> {
  const isColorSupported = !process.env.NO_COLOR && process.stdout.isTTY;
  const c = {
    reset: isColorSupported ? '\x1b[0m' : '',
    bold: isColorSupported ? '\x1b[1m' : '',
    dim: isColorSupported ? '\x1b[2m' : '',
    green: isColorSupported ? '\x1b[32m' : '',
    yellow: isColorSupported ? '\x1b[33m' : '',
    red: isColorSupported ? '\x1b[31m' : '',
    cyan: isColorSupported ? '\x1b[36m' : '',
    gray: isColorSupported ? '\x1b[90m' : ''
  };

  console.log(`\n${c.bold}${c.cyan}===================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}  ATLAS SANCTUM PRE-FLIGHT ENVIRONMENT & API HEALTH CHECK          ${c.reset}`);
  console.log(`${c.cyan}===================================================================${c.reset}`);
  console.log(`${c.dim}Verifying critical environment variables, network connectivity, & APIs...${c.reset}\n`);

  let hasFatalErrors = false;
  let missingCriticalCount = 0;
  let warningCount = 0;
  let okCount = 0;

  const categories = Array.from(new Set(ENV_SPECS.map(s => s.category)));

  for (const category of categories) {
    console.log(`${c.bold}${c.cyan}▶ [${category}]${c.reset}`);
    const items = ENV_SPECS.filter(s => s.category === category);

    for (const item of items) {
      const rawVal = process.env[item.key];
      const hasValue = rawVal !== undefined && rawVal.trim().length > 0;

      if (hasValue) {
        okCount++;
        // Mask secrets when displaying
        const isSecret = item.key.includes('KEY') || item.key.includes('SECRET');
        const displayVal = isSecret 
          ? `${rawVal.slice(0, 4)}••••••••${rawVal.slice(-4)}`
          : rawVal;

        console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}${item.key.padEnd(22)}${c.reset} ${c.dim}(${displayVal})${c.reset}`);
      } else if (item.defaultValue !== undefined) {
        // Fallback default exists
        okCount++;
        console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}${item.key.padEnd(22)}${c.reset} ${c.yellow}using default:${c.reset} ${c.dim}${item.defaultValue}${c.reset}`);
      } else if (item.requiredForStartup) {
        hasFatalErrors = true;
        missingCriticalCount++;
        console.log(`  ${c.red}✖ FAIL${c.reset} ${c.bold}${item.key.padEnd(22)}${c.reset} ${c.red}REQUIRED FOR STARTUP${c.reset}`);
        console.log(`         ${c.dim}↳ ${item.description}${c.reset}`);
        console.log(`         ${c.yellow}↳ Troubleshooting: ${item.troubleshootingTip}${c.reset}`);
      } else {
        warningCount++;
        console.log(`  ${c.yellow}⚠ WARN${c.reset} ${c.bold}${item.key.padEnd(22)}${c.reset} ${c.yellow}Not set (optional / fallback active)${c.reset}`);
        console.log(`         ${c.dim}↳ ${item.description}${c.reset}`);
        console.log(`         ${c.cyan}↳ Info: ${item.troubleshootingTip}${c.reset}`);
      }
    }
    console.log('');
  }

  // 5. Network Connectivity Checks
  console.log(`${c.bold}${c.cyan}▶ [Network Connectivity & Gateways]${c.reset}`);
  
  // DNS Resolution check
  const dnsOk = await checkDns('firestore.googleapis.com');
  if (dnsOk) {
    okCount++;
    console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}DNS Resolution        ${c.reset} ${c.dim}(firestore.googleapis.com resolved)${c.reset}`);
  } else {
    warningCount++;
    console.log(`  ${c.yellow}⚠ WARN${c.reset} ${c.bold}DNS Resolution        ${c.reset} ${c.yellow}Cannot resolve external Google Cloud hostnames${c.reset}`);
  }

  // Google API Endpoint check
  const apiEndpoint = await checkHttps('https://generativelanguage.googleapis.com');
  if (apiEndpoint.ok) {
    okCount++;
    console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}Gemini API Gateway    ${c.reset} ${c.dim}(reachable, ${apiEndpoint.latencyMs}ms latency)${c.reset}`);
  } else {
    warningCount++;
    console.log(`  ${c.yellow}⚠ WARN${c.reset} ${c.bold}Gemini API Gateway    ${c.reset} ${c.yellow}External outbound HTTPS request timed out / blocked${c.reset}`);
  }

  // Local Express Port Check
  const port = parseInt(process.env.PORT || '3000', 10);
  const localServer = await checkLocalServer(port);
  if (localServer.ok) {
    okCount++;
    console.log(`  ${c.green}✔ PASS${c.reset} ${c.bold}Local Server Probe    ${c.reset} ${c.dim}(http://localhost:${port}/api/health responded 200 OK)${c.reset}`);
  } else {
    // If not running right now, this is normal during pre-boot CI/CD
    console.log(`  ${c.cyan}ℹ INFO${c.reset} ${c.bold}Local Server Probe    ${c.reset} ${c.dim}(Server offline or not yet started on port ${port})${c.reset}`);
  }
  console.log('');

  // Summary Banner
  console.log(`${c.cyan}-------------------------------------------------------------------${c.reset}`);
  console.log(`${c.bold}SUMMARY:${c.reset} ${c.green}${okCount} Active/Default${c.reset} | ${c.yellow}${warningCount} Warnings${c.reset} | ${c.red}${missingCriticalCount} Fatal Errors${c.reset}`);

  if (hasFatalErrors) {
    console.error(`\n${c.red}${c.bold}[FATAL ERROR] Diagnostic check failed: Missing required environment variables.${c.reset}`);
    console.error(`${c.yellow}Please configure the missing keys listed above before deployment.${c.reset}\n`);
    return false;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.log(`\n${c.yellow}${c.bold}[NOTE] GEMINI_API_KEY is not currently set in the environment.${c.reset}`);
    console.log(`${c.dim}The server will initialize gracefully with embedded multimodal reasoning fallbacks.${c.reset}`);
    console.log(`${c.dim}To enable live Gemini 3.8 Flash queries, configure GEMINI_API_KEY via Settings.${c.reset}`);
  }

  console.log(`\n${c.green}${c.bold}✔ Diagnostic health check passed. Deployment pipeline ready.${c.reset}\n`);
  return true;
}

runHealthCheck().then((success) => {
  if (!success) {
    process.exit(1);
  }
});
