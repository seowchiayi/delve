// const axios = require('axios');
// const { Configuration, OpenAIApi } = require('openai');
// const markdownIt = require('markdown-it');
// const { createClient } = require('@supabase/supabase-js')
// const fs = require('fs')
// const path = require('path')
// require('dotenv').config()

// // Load environment variables
// //const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
// // const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // const { OpenAI } = require('openai');

// // // Initialize OpenAI with your API key
// // const openai = new OpenAI({
// //     apiKey: OPENAI_API_KEY, // Add your key here or through .env
// // });

// const supabaseUrl = process.env.SUPABASE_URL || null;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

// if (!supabaseUrl || !supabaseServiceRoleKey) {
//   throw new Error('Missing Supabase URL or service role key')
// }

// const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: false
//   }
// })

// async function checkMFAStatus() {
//   try {
//     const { data, error } = await supabase.auth.admin.listUsers()
//     if (error) throw error

//     const mfaStatus = data.users.map(user => ({
//       id: user.id,
//       email: user.email,
//       mfaEnabled: user.factors && user.factors.length > 0
//     }))

//     return mfaStatus
//   } catch (error) {
//     console.error('Error checking MFA status:', error)
//     return error
//   }
// }

// async function checkRLS() {
//   try {
//     const { data, error } = await supabase.rpc('check_rls_status')
//     if (error) throw error

//     return data
//   } catch (error) {
//     console.error('Error checking RLS status:', error)
//     return error
//   }
// }

// async function checkPITR() {
//   try {
//     const { data, error } = await supabase.from('projects').select('pitr_enabled')
//     if (error) throw error

//     return data.every(project => project.pitr_enabled)
//   } catch (error) {
//     console.error('Error checking PITR status:', error)
//     return error
//   }
// }

// async function performChecks() {
//   const mfaStatus = await checkMFAStatus()

//   const rlsStatus = await checkRLS()
//   const pitrStatus = await checkPITR()

//   const logMessage = `
// Timestamp: ${new Date().toISOString()}
// MFA Status: ${JSON.stringify(mfaStatus, null, 2)}
// RLS Status: ${JSON.stringify(rlsStatus, null, 2)}
// PITR Enabled for all projects: ${JSON.stringify(pitrStatus, null, 2)}
// `

//   const logFilePath = path.join(__dirname, 'supabase_checks.log')
//   fs.appendFileSync(logFilePath, logMessage)

//   console.log('Checks completed. Results logged to supabase_checks.log')

//   return logMessage
// }

// // Chat endpoint
// const chat = async (req, res) => {
//     const { content } = req.body;
//     const h = req.headers.authorization;
//     console.log(h)
//     if (content.toLowerCase() === 'perform checks') {
//         //const response = `You asked about: ${content}. This is a mock response from the internal documentation system.`;
//         //res.json({ response });
//         const results = await performChecks();
//         res.json({ response: results });
//     }
//     else {
//         const response = `${content}`
//         res.json({ response });
//     }

// };

// // // URL processing endpoint
// // const processUrl = async (req, res) => {
// //     const { content } = req.body;
// //     const urls = [content.split(" has been uploaded")[0]];
// //     const headers = { Authorization: `token ${GITHUB_ACCESS_TOKEN}` };
// //     const md = new markdownIt();

// //     const results = await Promise.all(
// //         urls.map(async (url) => {
// //             try {
// //                 const response = await axios.get(url, { headers });
// //                 if (response.status === 200) {
// //                     const markdownContent = response.data;
// //                     const htmlContent = md.render(markdownContent);
// //                     return htmlContent; // Add trimming logic here if needed
// //                 }
// //             } catch (error) {
// //                 console.error(`Error fetching URL ${url}:`, error.message);
// //                 return null;
// //             }
// //         })
// //     );

// //     const faqs = [];
// //     let index = 1;
// //     for (const content of results) {
// //         if (content) {
// //             const prompt = `
// //                 Generate 5 FAQs based on the content below.
// //                 Questions should start with Q and be enumerated starting from ${index}.
// //                 Content: ${content}
// //             `;

// //             try {
// //                 const completion = await openai.createChatCompletion({
// //                     model: 'gpt-4o-mini',
// //                     messages: [{ role: 'user', content: prompt }],
// //                 });

// //                 faqs.push(completion.data.choices[0].message.content);
// //                 index += 5;
// //             } catch (error) {
// //                 console.error('OpenAI API error:', error.message);
// //             }
// //         }
// //     }

// //     res.json({ response: faqs });
// // };

// module.exports = { chat };