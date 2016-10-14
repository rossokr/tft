var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  name    : String,
  status : String,
  dateCreated : { type : Date, default: Date.now },
  players : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  tats : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tat' }]
},{timestamps: true});

module.exports = mongoose.model('Match', matchSchema);