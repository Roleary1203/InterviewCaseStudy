const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.static(__dirname + '/../client/dist'));
app.use(cors())


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.listen(port, () => console.log(`listening on port ${port}`));
