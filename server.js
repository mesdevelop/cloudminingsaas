// server.js
const express = require('express');
const net = require('net');

const app = express();

// Funzione per verificare se una porta è disponibile
const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);  // Porta già occupata
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);  // Porta disponibile
    });

    server.listen(port);
  });
};

// Funzione per avviare il server su una porta disponibile
const startServer = async (port) => {
  const isPortFree = await checkPort(port);

  if (isPortFree) {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } else {
    console.log(`Port ${port} is in use, trying port ${port + 1}...`);
    startServer(port + 1);  // Fallback sulla porta successiva
  }
};

// Imposta la porta di partenza e avvia il server
const PORT = process.env.PORT || 3000;  // Usa la porta definita nell'ambiente o la 3000
startServer(PORT);

// Definisci una route di esempio
app.get('/', (req, res) => {
  res.send('Benvenuto nel tuo SaaS di Cloud Mining!');
});
