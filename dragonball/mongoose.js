const mongoose = require('mongoose')

function initMongoose() {
  mongoose.connect('mongodb://localhost/dragonball')
}

const Schema = mongoose.Schema

const episodesSchema = new Schema({
	name: String,
	url: String,
	number: Number
})

const Episodes = mongoose.model('episodes', episodesSchema)

module.exports = {
	Episodes,
	initMongoose
}