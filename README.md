# Daanish School Gate Pass

**A printable student leave form, with a separate WhatsApp PDF-search utility.**

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat-square&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

This repository contains two independent entrypoints. The root `index.html` is a browser-based leave application and printable gate-pass layout. The Node application under `src/` is a WhatsApp utility that searches text extracted from local PDFs and replies with matching snippets and filenames.

| Entry point | What it does | Runtime |
|---|---|---|
| `index.html` | Collects leave details and creates a printable pass | Web browser |
| `src/main.js` | Reads incoming WhatsApp messages and searches local PDF text | Node.js and Chromium |

The two paths are not integrated. Running `npm start` launches the WhatsApp utility, not the leave-form website.

## Leave form

Serve the repository using a local static server, for example with Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`, complete the form, and use the print action to print or save a PDF through the browser. The page validates fields and return dates, then creates the pass in the browser. Google Fonts require a network connection.

The displayed verification step is a timed interface transition. The generated reference is a client-side random identifier; the application does not perform institutional approval, authorization, or database verification. Use appropriate authorization procedures before using a generated form as an operational gate pass.

## PDF search utility

Use Node.js and npm, a Chromium-capable environment, and a WhatsApp account you are authorized to connect.

```sh
git clone https://github.com/adeelfalaksher900-creator/Daanish-School-Gate-Pass.git
cd Daanish-School-Gate-Pass
npm ci
```

Create a `pdfs/` directory at the repository root and place permitted text-based PDF documents inside it. Then run:

```sh
npm start
```

Scan the terminal QR code using the intended WhatsApp account. Once ready, the utility loads the PDFs. Incoming messages of at least three characters are matched using case-insensitive substring search. A match produces a reply containing surrounding text and the source filename; a non-match produces no reply.

Only connect a test account and documents suitable for automatic replies. Session state is stored locally by `LocalAuth`. The current implementation logs message text and sender identifiers and has no sender allowlist or per-document permission system. Keep private PDFs, session files, and logs out of commits.

## Project map

| Path | Responsibility |
|---|---|
| `index.html` | Leave form, validation, pass layout, and print styles |
| `src/main.js` | WhatsApp connection, QR login, and message replies |
| `src/indexer.js` | PDF loading, text extraction, and substring matching |
| `pdfs/` | Local document input; created when needed |
| `package.json` | Node scripts and dependencies |

## Validation

The package's `npm test` command is a placeholder that exits with an error. No passing automated test suite is claimed. The PDF parser integration and Chromium/WhatsApp compatibility must be checked in the intended runtime before relying on the utility.

For the browser page, verify field errors, date ordering, pass contents, print layout, and the new-application reset using fictional records.

## Contributing

Submit a focused pull request for review. State which entrypoint it changes and how you tested it. Do not include student records, private PDFs, WhatsApp sessions, or personal messages.

## License

`package.json` declares ISC for the Node package. A standalone license file is not currently included; clarify the scope of reuse with the repository owner.
