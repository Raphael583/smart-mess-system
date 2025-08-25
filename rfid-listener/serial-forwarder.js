const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
const express = require('express'); // 👈 To accept stop/start commands
const app = express();

app.use(express.json());

// ✅ Set the correct COM port and baud rate
const port = new SerialPort({
  path: 'COM4',       // 👈 Your working port
  baudRate: 115200,
  autoOpen: false
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let lastUID = null;
let timeout = null;
let isListening = true; // 👈 frontend can toggle this

// Open the port
port.open((err) => {
  if (err) {
    return console.error(`❌ Error opening port: ${err.message}`);
  }
  console.log('📡 Serial connection opened. Listening for RFID scans...');
});

// Handle incoming UID
parser.on('data', async (data) => {
  if (!isListening) return; // 👈 skip if frontend stopped listening

  const uid = data.replace(/^UID:\s*/i, '').trim();
  if (!uid || uid === lastUID) return;

  lastUID = uid;

  // reset 2-minute timer
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('⌛ UID expired.');
    lastUID = null;
    timeout = null;
  }, 2 * 60 * 1000);

  console.log(`📥 UID received: ${uid}`);

  try {
    const response = await axios.post('http://localhost:3000/rfid/scan', { uid });
    console.log('✅ Sent to backend:', response.data);
  } catch (err) {
    console.error('❌ Error sending to backend:', err.message);
  }
});

//
// ✅ REST API to control listening from frontend
//
app.post('/rfid/start', (req, res) => {
  isListening = true;
  console.log('▶️ RFID listening ENABLED by frontend');
  res.json({ message: 'RFID listening started' });
});

app.post('/rfid/stop', (req, res) => {
  isListening = false;
  console.log('⏹️ RFID listening DISABLED by frontend');
  res.json({ message: 'RFID listening stopped' });
});

// Run control server on port 4000
app.listen(4000, () => {
  console.log('🌐 Control server running at http://localhost:4000');
});
