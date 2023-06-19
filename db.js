const mongoose = require('mongoose');
const app = require('./index');
const PORT = 3001;
require('dotenv').config()

mongoose.connect(process.env.MONGOURI, {
      useNewurlParser: true,
      useUnifiedTopology: true,
}).then(() => {
      console.log("connected to mongoose");
      app.listen(PORT, () => {
            console.log(`Listening to port - ${PORT}`);
            console.log(`http://localhost:${PORT}/`);
      });
}).catch((err) => {
      console.log(`connected to mongoose${err}`)
});