import { PRIORITY_TYPES, ICON_TYPES, NOTE_ACTIONS } from './utils/constants';
import Notepad from './notepad-model';

export default class View {
  constructor(Notepad) {
    this._notepad = Notepad;
    this.refs = {};
    this.refs.noteList = document.querySelector('.note-list');
    this.refs.search = document.querySelector('.search-form input');
    this.refs.form = document.querySelector('.note-editor');
    this.refs.noteTitle = this.refs.form.querySelector('input[name="note_title"]');
    this.refs.noteBody = this.refs.form.querySelector('textarea[name="note_body"]');
    this.onSubmit = this.onSubmit.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.refs.form.addEventListener('submit', this.onSubmit);
    this.refs.noteList.addEventListener('click', this.onNoteList.bind(this));
    this.refs.search.addEventListener('input', this.filterNotesByQuery.bind(this));
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
      this._notepad._notes.push(note);
      console.log(this._notes);
      this.addListItem(this.refs.noteList, this.createListItem(note));
      e.target.reset();
    }
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

  addListItem(listRef, note) {
    listRef.appendChild(note);
  }



  removeListItem(note) {
    this._notepad.deleteNote(note.dataset.id);
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