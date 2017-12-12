const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Acuitis = require('../db/Acuitis');
const Bents = require('../db/Bents');
const Blackheath = require('../db/Blackheath');
const Clasohlson = require('../db/Clasohlson');

let Integer = {
	type: Number,
	validate: {
		validator: Number.isInteger,
		message: '{VALUE} is not an integer'
	}
}

const visitorData = new mongoose.Schema({
    dateTime: {
    	type: Date
    },
    total_in: Integer,
    total_out: Integer
});

module.exports = {
    acuitis_Door0: Acuitis.model('acuitis', visitorData, 'Door0'), //@param1 modelName, @param2 schema, @param3 collection
    bents_garden_cook: Bents.model('bents_garden', visitorData, 'cook'),
    bents_garden_craft: Bents.model('bents_garden', visitorData, 'craft'),
    bents_garden_food: Bents.model('bents_garden', visitorData, 'food'),
    bents_garden_main: Bents.model('bents_garden', visitorData, 'main'),
    bents_garden_pet: Bents.model('bents_garden', visitorData, 'pet'),
    bents_garden_toy: Bents.model('bents_garden', visitorData, 'toy'),
    bents_garden_trespass: Bents.model('bents_garden', visitorData, 'trespass'),
    blackheath_fire: Blackheath.model('blackheath', visitorData, 'fire_exit'),
    blackheath_left: Blackheath.model('blackheath', visitorData, 'left_door'),
    blackheath_revolving: Blackheath.model('blackheath', visitorData, 'revolving_door'),
    clasohlson_Door0: Clasohlson.model('clasohlson', visitorData, 'Door0'),
    clasohlson_Door1: Clasohlson.model('clasohlson', visitorData, 'Door1'),
    clasohlson_Door2: Clasohlson.model('clasohlson', visitorData, 'Door2'),
    clasohlson_Door3: Clasohlson.model('clasohlson', visitorData, 'Door3')
}