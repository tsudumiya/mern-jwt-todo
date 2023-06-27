const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();
// const cors = require('cors');
const PORT = process.env.PORT || 8080;

app.use('/', express.static('build'));
// app.use(
//     cors({
//         origin: '*',
//     })
// );
app.use(express.json());
app.use('/api/v1', require('./src/v1/routes'));

// app.get('/', (req, res) => {
//     res.send('Hello Express');
// });
app.get('*', function (req, res) {
    const indexHtml = path.resolve('build', 'index.html');
    res.sendFile(indexHtml);
});

// DB接続
try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log('DBと接続中...');
} catch (error) {
    console.log(error);
}

app.listen(PORT, () => {
    console.log('ローカルサーバーが起動中...');
});
