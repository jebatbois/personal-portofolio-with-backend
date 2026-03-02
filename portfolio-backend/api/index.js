const serverless = require('serverless-http');
const app = require('../src/index.js'); // Mengambil aplikasi Express dari folder src

module.exports = serverless(app); // Membungkusnya menjadi Serverless Vercel