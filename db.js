const connectionString = `mongodb://localhost:27017/emailDB`;

const mongoose = require('mongoose');
mongoose.connect(connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true
}).then(() => console.log(`MongoDB started`)).catch(err => console.log(err));
mongoose.Promise = global.Promise;

module.exports = {
  Email: require('./email'),
};

