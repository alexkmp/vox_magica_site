const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  count: String,
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
