
var dispatcher = require('./notelloDispatcher');
var api = require('../common/api');
var lscache = require('ls-cache');
var updateUserNotesAction = require('../actions/updateUserNotes');
var domUtility = require('../common/dom-utils');

var _updateUserNotes = function (userNotes, noteId, noteTitle, noteText) {

	userNotes.push({
		itemType: 'note',
		noteId: noteId,
		noteTitle: noteTitle
	});

	dispatcher.dispatchDiscrete('createNoteCompleted', {
		userNotes: userNotes,
		newNote: {
			noteId: noteId,
			noteTitle: noteTitle,
			noteText: noteText
		}
	});

	updateUserNotesAction(userNotes);
};

var createNoteAction = function (userNotes, noteTitle, noteText) {

	if (lscache.get('isAuthenticated')) {		

		api({
			url: 'api/note',
			method: 'post',
			data: {
				noteTitle: noteTitle,
				noteText: noteText
			},
			success: function (result) {

				_updateUserNotes(userNotes, result.noteId, noteTitle, noteText);
		    }
		});

	} else {

		var newNote = {

			noteId: domUtility.randomUUID(),
			noteTitle: noteTitle,
			noteText: noteText
		};

		lscache.set('unAuthNote_' + newNote.noteId, newNote);

		_updateUserNotes(userNotes, newNote.noteId, noteTitle, noteText);
	}
};

module.exports = createNoteAction;
