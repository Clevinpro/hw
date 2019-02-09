'use strict';
import Notepad from './notepad-model';
import View from './view';
import { PRIORITY_TYPES } from './utils/constants';

const initialNotes = [
  {
    id: 1,
    title: 'JavaScript essentials',
    body:
      'Get comfortable with all basic JavaScript concepts: variables, loops, arrays, branching, objects, functions, scopes, prototypes etc',
    priority: PRIORITY_TYPES.HIGH
  },
  {
    id: 2,
    title: 'Refresh HTML and CSS',
    body:
      'Need to refresh HTML and CSS concepts, after learning some JavaScript. Maybe get to know CSS Grid and PostCSS, they seem to be trending.',
    priority: PRIORITY_TYPES.NORMAL
  },
  {
    id: 3,
    title: 'Get comfy with Frontend frameworks',
    body:
      'First should get some general knowledge about frameworks, then maybe try each one for a week or so. Need to choose between React, Vue and Angular, by reading articles and watching videos.',
    priority: PRIORITY_TYPES.NORMAL
  },
  {
    id: 4,
    title: 'Winter clothes',
    body:
      "Winter is coming! Need some really warm clothes: shoes, sweater, hat, jacket, scarf etc. Maybe should get a set of sportwear as well so I'll be able to do some excercises in the park.",
    priority: PRIORITY_TYPES.LOW
  }
];







const view = new View();
const notepad = new Notepad(initialNotes, view);
view.renderNoteList(view.refs.noteList, notepad._notes);

notepad.saveNote({title: 'tt', body: 'bb'}).then((note) => {
  view.addListItem(view.refs.noteList, note);
});

// view.addListItem(view.refs.noteList, note)
// ;



