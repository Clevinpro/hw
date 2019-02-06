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
    this.refs.form = document.querySelector('.note-editor');
    this.refs.search = document.querySelector('.search-form input');
    this.refs.noteTitle = this.refs.form.querySelector('input[name="note_title"]');
    this.refs.noteBody = this.refs.form.querySelector('textarea[name="note_body"]');
    this.renderNoteList(this.refs.noteList, this._notes);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.refs.form.addEventListener('submit', this.onSubmit);
    this.refs.noteList.addEventListener('click', this.onNoteList.bind(this));
    this.refs.search.addEventListener('input', this.filterNotesByQuery.bind(this))
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
    const sectionSecond = section.cloneNode(true);
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

  createListItem(data = {}) {
    const li = document.createElement('li');
    const div = document.createElement('div');

    li.className = 'note-list__item';
    li.dataset.id = data.id;
    div.className = 'note';
    div.appendChild(this.createNoteContent(data.title, data.body));
    div.appendChild(this.createNoteFooter());
    li.appendChild(div);

    return li;
  }

  renderNoteList(listRef, notes) {
    listRef.innerHTML = ''; // не додумался как лучше перересовывать
    notes.forEach(el => {
      listRef.append(this.createListItem(el));
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

  filterNotesByQuery(e) {
    /*
     * Фильтрует массив заметок по подстроке query.
     * Если значение query есть в заголовке или теле заметки - она подходит
     *
     * Принимает: подстроку для поиска в title и body заметки
     * Возвращает: новый массив заметок, контент которых содержит подстроку
     */
    const query = e.target.value;
    const filtred = this._notes.filter(el => {
      if (
        el.title.toLowerCase().includes(query.toLowerCase()) ||
        el.body.toLowerCase().includes(query.toLowerCase())
      ) return el;
    });
    this.renderNoteList(this.refs.noteList, filtred);
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

  onSubmit(e) {
    e.preventDefault();
    const title = this.refs.noteTitle.value;
    const body = this.refs.noteBody.value;
    console.log(body, title);
    if (title === '' && body === '') {
      return alert('Необходимо заполнить все поля!');
    } else {
      const note = {
        id: generateUniqueId(),
        title,
        body,
        priority: PRIORITY_TYPES.HIGH,
      };
      this._notes.push(note);
      console.log(this._notes);
      this.addListItem(this.refs.noteList, this.createListItem(note));
      e.target.reset();
    }
  }

  addListItem(listRef, note) {
    listRef.appendChild(note);
  }

  onNoteList(e) {
    const button = e.target.closest('BUTTON');
    if(button.nodeName !== 'BUTTON') {
      return
    }
    if (button.dataset.action === NOTE_ACTIONS.DELETE) {
      this.removeListItem(button.closest('.note-list__item'))

    }
  }

  removeListItem(note) {
    this.deleteNote(note.dataset.id);
    note.remove();
  }


}


const generateUniqueId = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);

const notepad = new Notepad(initialNotes);



console.log(notepad.notes);

notepad.createNoteContent();
notepad.createNoteFooter();
notepad.createListItem();


