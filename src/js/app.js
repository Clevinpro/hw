'use strict';

import { PRIORITY_TYPES, ICON_TYPES, NOTE_ACTIONS } from './utils/constants';

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


class Notepad {
  constructor(notes = []) {
    this._notes = notes;
    this.refs = {};
    this.refs.noteList = document.querySelector('.note-list');
    this.renderNoteList(this.refs.noteList, this._notes);
  }

  static getPriorityName(priorityId) {
    return Notepad.PRIORITIES[priorityId].name;
  }

  get notes() {
    return this._notes;
  }

  set notes(notes) {
    return this._notes = notes;
  }

// <footer class="note__footer">
//     <section class="note__section">
//     <button class="action" data-action="decrease-priority">
//     <i class="material-icons action__icon">expand_more</i>
//     </button>
//     <button class="action" data-action="increase-priority">
//     <i class="material-icons action__icon">expand_less</i>
//     </button>
//     <span class="note__priority">Priority: Low</span>
// </section>
// <section class="note__section">
//     <button class="action" data-action="edit-note">
//     <i class="material-icons action__icon">edit</i>
//     </button>
//     <button class="action" data-action="delete-note">
//     <i class="material-icons action__icon">delete</i>
//     </button>
//     </section>
//     </footer>

  createNoteContent(title, body) {
    const div = document.createElement('DIV');
    const h2 = document.createElement('H2');
    const p = document.createElement('P');

    div.className = 'note__content';
    h2.textContent = title;
    h2.className = 'note__title';
    p.className = 'note__body';
    p.textContent = body;
    div.appendChild(h2);
    div.appendChild(p);

    return div;
  }

  createNoteFooter() {
    const footer = document.createElement('footer');
    const section = document.createElement('section');
    section.className = 'note__section';
    const sectionSecond = section.cloneNode(true);;
    section.appendChild(
      this.createActionButton(
        NOTE_ACTIONS.DECREASE_PRIORITY,
        ICON_TYPES.ARROW_DOWN,
      )
    );
    section.appendChild(
      this.createActionButton(
        NOTE_ACTIONS.INCREASE_PRIORITY,
        ICON_TYPES.ARROW_UP,
      )
    );
    sectionSecond.appendChild(
      this.createActionButton(
        NOTE_ACTIONS.EDIT,
        ICON_TYPES.EDIT,
      )
    );
    sectionSecond.appendChild(
      this.createActionButton(
        NOTE_ACTIONS.DELETE,
        ICON_TYPES.DELETE,
      )
    );
    footer.className = 'note__footer';
    footer.appendChild(section);
    footer.appendChild(sectionSecond);


    return footer;

  }

  createActionButton(action, iconText) {
    const button = document.createElement('button');
    const i = document.createElement('i');

    button.className = 'action';
    button.dataset.action = action;
    i.className = 'material-icons action__icon';
    i.textContent = iconText;
    button.appendChild(i);

    return button
  }

  createListItem(note) {
    const li = document.createElement('li');
    const div = document.createElement('div');

    li.className = 'note-list__item';
    div.className = 'note';
    div.appendChild(this.createNoteContent(note.title, note.body));
    div.appendChild(this.createNoteFooter());
    li.appendChild(div);

    return li;
  }

  renderNoteList(listRef, notes) {
    notes.forEach(el => {
      listRef.appendChild(this.createListItem(el));
    })
  }

  findNoteById(id) {
    return this.notes.find(el => el.id === id)[0];
  }

  saveNote(note) {
    /*
     * Сохраняет заметку в массив notes
     *
     * Принимает: объект заметки
     * Возвращает: сохраненную заметку
     */
    this.notes.push(note);
    return note;
  }

  deleteNote(id) {
    /*
     * Удаляет заметку по идентификатору из массива notes
     *
     * Принимает: идентификатор заметки
     * Возвращает: ничего
     */
    this.notes = this.notes.filter(el => el.id !== id);
  }

  updateNoteContent(id, updatedContent) {
    /*
     * Обновляет контент заметки
     * updatedContent - объект с полями вида {имя: значение, имя: значение}
     * Свойств в объекте updatedContent может быть произвольное количество
     *
     * Принимает: идентификатор заметки и объект, полями которого надо обновить заметку
     * Возвращает: обновленную заметку
     */
    let updatedNote;
    this.notes = this.notes.map(el => {
      if (el.id === id) {
        updatedNote = { ...el, ...updatedContent };
        return updatedNote;
      }
      return el;
    });
    return updatedNote;
  }

  updateNotePriority(id, priority) {
    /*
     * Обновляет приоритет заметки
     *
     * Принимает: идентификатор заметки и ее новый приоритет
     * Возвращает: обновленную заметку
     */
    let updatedNote;
    this.notes.map(el => {
      if (el.id === id) {
        updatedNote = el;
        updatedNote.priority = priority;
        return updatedNote;
      }
      return el;
    });
    return updatedNote;
  }

  filterNotesByQuery(query) {
    /*
     * Фильтрует массив заметок по подстроке query.
     * Если значение query есть в заголовке или теле заметки - она подходит
     *
     * Принимает: подстроку для поиска в title и body заметки
     * Возвращает: новый массив заметок, контент которых содержит подстроку
     */
    const filtred = this.notes.filter(el => {
      if (
        el.title.toLowerCase().includes(query.toLowerCase()) ||
        el.body.toLowerCase().includes(query.toLowerCase())
      )
        return el;
    });
    return filtred;
  }

  filterNotesByPriority(priority) {
    /*
     * Фильтрует массив заметок по значению приоритета
     * Если значение priority совпадаем с приоритетом заметки - она подходит
     *
     * Принимает: приоритет для поиска в свойстве priority заметки
     * Возвращает: новый массив заметок с подходящим приоритетом
     */
    return this.notes.filter(el => el.priority === priority);
  }
}


const notepad = new Notepad(initialNotes);



console.log(notepad.notes);

notepad.createNoteContent();
notepad.createNoteFooter();
notepad.createListItem();