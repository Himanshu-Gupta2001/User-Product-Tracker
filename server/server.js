const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./routes.js')

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/', routes);

app.listen(process.env.PORT, () => { console.log(`Server is listening at ${process.env.PORT}`) })