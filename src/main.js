const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { loadPdfs, searchDocuments } = require('./indexer');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js',
    }
});

let documents = [];

client.on('qr', (qr) => {
    console.log('Scan the QR code below to log in to WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('WhatsApp client is ready!');
    console.log('Loading PDFs...');
    documents = await loadPdfs();
    console.log(`${documents.length} PDFs loaded and indexed.`);
});

client.on('message', async (msg) => {
    const query = msg.body;
    if (!query || query.length < 3) return;

    console.log(`Received message: "${query}" from ${msg.from}`);

    const results = searchDocuments(query, documents);

    if (results.length > 0) {
        let response = "I found some information related to your query:\n\n";
        results.forEach((res, index) => {
            response += `${index + 1}. ${res.snippet}\nSource: ${res.filename}\n\n`;
        });
        msg.reply(response);
    } else {
        // If no results, we might not want to spam everyone,
        // but since the requirement is to reply if anyone messages information,
        // we can either stay silent or give a default reply.
        // Given "you give the reply to this and sources", it implies we should reply when there is a match.
        // Let's only reply when there are results to avoid being a generic bot.
    }
});

client.initialize();
