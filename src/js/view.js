import { NOTE_ACTIONS } from './utils/constants';
import Handlebars from '../js/libs/handlebars';


export default class View {
  constructor(Notepad) {
    this._notepad = Notepad;
    this.refs = {};
    this.refs.noteList = document.querySelector('.note-list');
    this.refs.openEditor = document.querySelector('button[data-action="open-editor"]');
    this.refs.search = document.querySelector('.search-form input');
    this.removeListItem = this.removeListItem.bind(this);
    this.refs.search.addEventListener('input', this.filterNotesByQuery.bind(this));
    this.source = document.querySelector("#cards-tmpl").innerHTML.trim();
    this.template = Handlebars.compile(this.source);
  }

  renderNoteList(listRef, notes) {
    listRef.innerHTML = '';
    const markup = notes.reduce((acc, item) => acc + this.template(item), '');

    listRef.insertAdjacentHTML('afterbegin', markup);
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
    const filtred = this._notepad._notes.filter(el => {
      if (
        el.title.toLowerCase().includes(query.toLowerCase()) ||
        el.body.toLowerCase().includes(query.toLowerCase())
      ) return el;
    });
    this.renderNoteList(this.refs.noteList, filtred);
    return filtred;
  }



  addListItem(listRef, note) {
    const markup = this.template(note);
    listRef.insertAdjacentHTML('afterbegin', markup);
  }



  removeListItem(note) {
    note.remove();
  }


}

