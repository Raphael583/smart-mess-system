const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// ✅ Set the correct COM port and baud rate
const port = new SerialPort({
  path: 'COM4',       // 👈 CONFIRMED working port
  baudRate: 115200,   // 👈 Baud rate
  autoOpen: false     // Let’s open it manually with error handling
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// ⏱ Timeout to expire UID after 2 minutes
let lastUID = null;
let timeout = null;

function expireUID() {
  console.log('⌛ UID expired.');
  lastUID = null;
  timeout = null;
}

// Open the port
port.open((err) => {
  if (err) {
    return console.error(`❌ Error opening port: ${err.message}`);
  }
  console.log('📡 Serial connection opened. Listening for RFID scans...');
});

// Handle incoming UID
parser.on('data', async (data) => {
 const uid = data.replace(/^UID:\s*/i, '').trim();

  // Ignore if same UID is scanned repeatedly
  if (!uid || uid === lastUID) return;

  lastUID = uid;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(expireUID, 2 * 60 * 1000); // 2 minutes

  console.log(`📥 UID received: ${uid}`);

  try {
    const response = await axios.post('http://localhost:3000/rfid/scan', { uid });
    console.log('✅ Sent to backend:', response.data);
  } catch (err) {
    console.error('❌ Error sending to backend:', err.message);
  }
});
