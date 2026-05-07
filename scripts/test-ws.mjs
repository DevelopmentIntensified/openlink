import { createClient } from '@libsql/client/ws';

const url = 'libsql://openlinktst-developmentintensified.aws-us-east-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2MTE0ODcsImlkIjoiMDE5Y2YzN2ItNjcwMS03NDA4LThmMjItNWIzZWJhNzU0MGYyIiwicmlkIjoiOWI2ZjAyYWYtMDc3My00NmE5LWI5OWUtNDY4YjRkYmUyNzg1In0.oc7ECXTkNHjoVW93BgmAPLiEXAVCLq9wsfXYglTLt31go1jYnFkY38bBVMhxg0OYb3d1kfr1YEapcEUYPS8DAQ';

console.log('Using WS client...');
try {
  const client = createClient({ url, authToken });
  const result = await client.execute('SELECT 1 as test');
  console.log('Success!', result.rows);
  client.close();
} catch (e) {
  console.error('Error:', e.message, e.code);
}
