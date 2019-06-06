const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  deliveryStatus: {type: String}
});

schema.set ('toJSON', {virtuals: true});

module.exports = mongoose.model('Email', schema);