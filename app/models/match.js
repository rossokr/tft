var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  name    : String,
  players : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  tats : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tat' }]
});

module.exports = mongoose.model('Match', matchSchema);