const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User_DB = require('../db/User_Conn');

const Users = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    database: String,
    collections: Array,
    lastLogin: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer.'
        }
    },
    lastIp: String,
    loggedIn: Boolean
});

module.exports = User_DB.model('User', Users, 'users');