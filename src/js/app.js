'use strict';
import Notepad from './notepad-model';
import View from './view';
import { PRIORITY_TYPES } from './utils/constants';
import { addNote, loadNotes } from './services/api';



const view = new View();
const notepad = new Notepad([], view);
loadNotes().then(notes =>
  view.renderNoteList(view.refs.noteList, notes));

//
// notepad.saveNote({title: 'tt', body: 'bb'}).then((note) => {
//   view.addListItem(view.refs.noteList, note);
// });

// view.addListItem(view.refs.noteList, note)
// ;



