const Modbus = require('modbus-serial');
const client = new Modbus();

// Set the Modbus slave address and communication settings
const slaveAddress = 1; // Replace with your actual Modbus slave address
const port = '/dev/ttyUSB0'; // Replace with your actual serial port

client.connectRTUBuffered(port, { baudRate: 9600, parity: 'none' }, () => {
  // Connected to the Modbus RTU device
    client.setID(1);
  const startAddress = 0;
  const quantity = 8; // Number of discrete inputs to read

  client.readDiscreteInputs(startAddress, quantity, slaveAddress, (err, data) => {
    if (err) {
      // Handle errors, including timeouts or other communication issues
      console.error('Error:', err.message);
    } else {
      // Handle successful response
      console.log('Response:', data.data);

      // Your logic to process the received data goes here
    }

    // Close the Modbus connection
    client.close(() => {
      console.log('Modbus connection closed');
    });
  });
});

// Handle connection errors
client.on('error', (err) => {
  console.error('Connection error:', err.message);
});
