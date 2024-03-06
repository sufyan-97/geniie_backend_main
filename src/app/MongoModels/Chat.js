var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var chat = new Schema({
	message: {
		type: String,
		required: true
	},
	sender: {
		type: Number,
		required: true
	},
	receiver: {
		type: Number,
		required: true
	},
	is_read: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	is_deleted: {
		type: Boolean,
		default: false
	},
	conversation_id: {
		type: Schema.Types.ObjectID,
		ref: 'Conversations',
		default: null
	}
});


var conversation = new Schema({
	sender: {
		type: Number,
		default: null
	},
	receiver: {
		type: Number,
		default: null
	},
	update_time: {
		type: Date,
		default: Date.now
	},

	is_deleted: {
		type: Boolean,
		default: false
	},

	isActive: {
		type: Boolean,
		default: true
	},

	orderId: {
		type: Number,
		default: null
	}
});


const messages = mongoose.model('Messages', chat);
const conversations = mongoose.model('Conversations', conversation);
module.exports = {
	messages: messages,
	conversations: conversations
};