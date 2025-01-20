require('dotenv').config();

const express = require('express');
const router = express();
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js');


app.use(express.static('public'));

const supabaseUrl = process.env.SUPABASE_URL || null;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || null;
const supabaseProjectRef = process.env.SUPABASE_PROJECT_ID
const supabaseToken = process.env.SUPABASE_ACCESS_TOKEN

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase URL or service role key')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkMFAStatus(id) {
  try {
    // Get Authenticator Assurance Level - https://supabase.com/docs/reference/javascript/auth-mfa-getauthenticatorassurancelevel
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    const { currentLevel, nextLevel, currentAuthenticationMethods } = data
    if (error) throw error

    return data.length > 0 
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
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${supabaseToken}`, // Include your API key
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json()

    
    if (!response.ok) throw error

    return data.pitr_enabled 
      ? 'PITR is enabled for all projects.' 
      : 'PITR is not enabled for all projects.';
  } catch (error) {
    return `Error checking PITR status: ${JSON.stringify(error)}`;
  }
}

async function performChecks(user) {
  const mfaStatus = await checkMFAStatus(user)
  const rlsStatus = await checkRLS(user)
  const pitrStatus = await checkPITR(user)

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

router.post('/chat', async (req, res) => {
  // Access the Authorization header
  const content = req.body

  if (content.content.toLowerCase() === 'perform checks') {
    //const response = `You asked about: ${content}. This is a mock response from the internal documentation system.`;
    //res.json({ response });
    const response = await performChecks(content.user);
    res.json({ response });
  }
  else {
    const response = `${content}`
    res.json({ response });
  }

});


module.exports = router;
