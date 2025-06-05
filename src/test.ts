// test.ts
import express from 'express';
const app = express();
app.get('/users/:', (req, res) => res.send('Test')); // Should trigger error
app.listen(3000, () => console.log('Running'));
console.log('test');
