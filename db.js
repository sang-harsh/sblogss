const mongoose = require('mongoose');
const constants = require('./private_constants');
const app = require('./index');
const PORT = 3000;

mongoose.connect(constants.MONGOURI, {
      useNewurlParser: true,
      useUnifiedTopology: true,
}).then(() => {
      console.log("connected to mongoose");
      app.listen(PORT, () => {
            console.log(`Listening to port${PORT}`);
      });
}).catch((err) => {
            console.log(`connected to mongoose${err}`)
});