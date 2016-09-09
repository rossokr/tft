var mongoose = require('mongoose')

var tatSchema = mongoose.Schema({
  player : { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  match : { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  title    : String,
  pointValue     : Number
});

module.exports = mongoose.model('Tat', tatSchema);

