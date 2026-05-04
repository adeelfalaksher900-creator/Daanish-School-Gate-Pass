const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfsDir = path.join(__dirname, '../pdfs');

/**
 * Loads and parses all PDF files in the pdfs directory.
 * @returns {Promise<Array<{filename: string, content: string}>>}
 */
async function loadPdfs() {
    if (!fs.existsSync(pdfsDir)) {
        console.warn(`PDFs directory not found: ${pdfsDir}. Creating it...`);
        fs.mkdirSync(pdfsDir, { recursive: true });
        return [];
    }
    const files = fs.readdirSync(pdfsDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    const documents = [];
    for (const file of pdfFiles) {
        const filePath = path.join(pdfsDir, file);
        const dataBuffer = fs.readFileSync(filePath);
        try {
            const data = await pdf(dataBuffer);
            documents.push({
                filename: file,
                content: data.text
            });
        } catch (error) {
            console.error(`Error parsing PDF ${file}:`, error);
        }
    }
    return documents;
}

/**
 * Searches for a query in the loaded documents.
 * @param {string} query
 * @param {Array<{filename: string, content: string}>} documents
 * @returns {Array<{filename: string, snippet: string}>}
 */
function searchDocuments(query, documents) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const doc of documents) {
        if (doc.content.toLowerCase().includes(lowerQuery)) {
            // Find a snippet around the match
            const index = doc.content.toLowerCase().indexOf(lowerQuery);
            const start = Math.max(0, index - 100);
            const end = Math.min(doc.content.length, index + lowerQuery.length + 100);
            const snippet = doc.content.substring(start, end).replace(/\n/g, ' ').trim();

            results.push({
                filename: doc.filename,
                snippet: `...${snippet}...`
            });
        }
    }
    return results;
}

module.exports = {
    loadPdfs,
    searchDocuments
};
