import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js';

const app = Express();

dotenv.config();

app.use(Express.json());

const allowedOrigins = [
  'https://delve-fysb.vercel.app',
  'http://localhost:3000', // Add local development origin
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseProjectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
const supabaseToken = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or service role key')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkMFAStatus() {
  try {
    // Get Authenticator Assurance Level - https://supabase.com/docs/reference/javascript/auth-mfa-getauthenticatorassurancelevel
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) throw error
    return data?.currentLevel
      ? `MFA is enabled for ${JSON.stringify(data)} user(s).` 
      : 'MFA is not enabled for user.';

  } catch (error) {
    return `Error checking MFA status: ${JSON.stringify(error)}`
  }
}

async function checkRLS() {
  try {
    const { data, error } = await supabase.rpc('check_rls_status', {table_name: 'profiles'})
    if (error) throw error

    return data ? 'RLS is enabled.' : 'RLS is not enabled.';
  } catch (error) {
    return `Error checking RLS status: ${JSON.stringify(error)}`
  }
}

async function checkPITR() {
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${supabaseProjectRef}/database/backups`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${supabaseToken}`, // Include your API key
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json()

    
    if (!response.ok) throw Error

    return data.pitr_enabled 
      ? 'PITR is enabled for all projects.' 
      : 'PITR is not enabled for all projects.';
  } catch (error) {
    return `Error checking PITR status: ${JSON.stringify(error)}`;
  }
}

async function performChecks() {
  const mfaStatus = await checkMFAStatus()
  const rlsStatus = await checkRLS()
  const pitrStatus = await checkPITR()

  const logMessage = `
    Timestamp: ${new Date().toISOString()}
    ${mfaStatus}
    ${rlsStatus}
    ${pitrStatus}
  `

  const logFilePath = path.join(__dirname, 'supabase_checks.log')
  fs.appendFileSync(logFilePath, logMessage)
  console.log('Checks completed. Results logged to supabase_checks.log')
  
  return logMessage
}
app.post("/api/chat", async (req, res) => {
  const { content } = req.body
  
  if (content.toLowerCase() === 'perform checks') {
    const response = await performChecks();
    res.json({ response });
  }
  else {
    const response = `${content}`
    res.json({ response });
  }
});

const PORT: number = parseInt(process.env.PORT || '8000', 10);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});