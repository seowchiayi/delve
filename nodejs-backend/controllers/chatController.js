const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const markdownIt = require('markdown-it');
// Load environment variables
//const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const { OpenAI } = require('openai');

// // Initialize OpenAI with your API key
// const openai = new OpenAI({
//     apiKey: OPENAI_API_KEY, // Add your key here or through .env
// });

// Chat endpoint
const chat = async (req, res) => {
    const { content } = req.body;
    if (content.toLowerCase() === 'Is MFA enabled for each user?') {
        const response = `You asked about: ${content}. This is a mock response from the internal documentation system.`;
        res.json({ response });
    }
    else {
        const response = `${content}`
        res.json({ response });
    }
    

    // (async () => {
    //     const chatResponse = await openai.chat.completions.create({
    //         model: "gpt-4",
    //         messages: [{ role: "user", content: "Hello, OpenAI!" }],
    //     });
    
    //     console.log(chatResponse.choices[0].message.content);
    // })();
};

// // URL processing endpoint
// const processUrl = async (req, res) => {
//     const { content } = req.body;
//     const urls = [content.split(" has been uploaded")[0]];
//     const headers = { Authorization: `token ${GITHUB_ACCESS_TOKEN}` };
//     const md = new markdownIt();

//     const results = await Promise.all(
//         urls.map(async (url) => {
//             try {
//                 const response = await axios.get(url, { headers });
//                 if (response.status === 200) {
//                     const markdownContent = response.data;
//                     const htmlContent = md.render(markdownContent);
//                     return htmlContent; // Add trimming logic here if needed
//                 }
//             } catch (error) {
//                 console.error(`Error fetching URL ${url}:`, error.message);
//                 return null;
//             }
//         })
//     );

//     const faqs = [];
//     let index = 1;
//     for (const content of results) {
//         if (content) {
//             const prompt = `
//                 Generate 5 FAQs based on the content below.
//                 Questions should start with Q and be enumerated starting from ${index}.
//                 Content: ${content}
//             `;

//             try {
//                 const completion = await openai.createChatCompletion({
//                     model: 'gpt-4o-mini',
//                     messages: [{ role: 'user', content: prompt }],
//                 });

//                 faqs.push(completion.data.choices[0].message.content);
//                 index += 5;
//             } catch (error) {
//                 console.error('OpenAI API error:', error.message);
//             }
//         }
//     }

//     res.json({ response: faqs });
// };

module.exports = { chat };