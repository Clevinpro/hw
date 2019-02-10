import Notify from '../js/libs/notyf.min';
import { PRIORITY_TYPES, NOTE_ACTIONS } from './utils/constants';
const notify = new Notify();
import { addNote, loadNotes, removeNote } from './services/api';


export default class Notepad {
  constructor(notes = [], View) {
    this.refs = {};
    this._notes = notes;
    this._view = View;
    this.refs.form = document.querySelector('.note-editor');
    this.refs.noteTitle = this.refs.form.querySelector('input[name="note_title"]');
    this.refs.noteBody = this.refs.form.querySelector('textarea[name="note_body"]');
    this.refs.openEditor = document.querySelector('button[data-action="open-editor"]');
    this._view.refs.noteList.addEventListener('click', this.onNoteList.bind(this));
    this._view.refs.openEditor.addEventListener('click', this.onOpenEditor.bind(this));
    this.refs.form.addEventListener('submit', this.onSumbit.bind(this));

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

  findNoteById(id) {
    return this._notes.find(el => el.id === id)[0];
  }

  saveNote({ title, body }) {

    return new Promise((resolve, reject) => {
        const note = {
          id: generateUniqueId(),
          title,
          body,
          priority: PRIORITY_TYPES.HIGH,
        };
        this._notes.push(note);
        addNote(note);
        notify.confirm('Заметки обновлены');
        return resolve(note);

    })
  }



  onSumbit(e) {
    e.preventDefault();
    const title = this.refs.noteTitle.value;
    const body = this.refs.noteBody.value;
    if (title === '' || body === '') {
      return notify.alert('Необходимо заполнить все поля!');
    } else {
      e.target.reset();
      this.saveNote({ title, body })
        .then((note) => {
          console.log('noootee', note);
          this._view.addListItem(this._view.refs.noteList, note);
          MicroModal.close('note-editor-modal');
        })
    }
  }

  deleteNote(note) {
    return new Promise((resolve, reject) => {
      this._notes = this._notes.filter(el => String(el.id) !== note.dataset.id);
      removeNote(note.dataset.id);
      notify.confirm('Заметки обновлены');
      return resolve(note);

    }).then((note) => {
      this._view.removeListItem(note)
    })


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
    this._notes = this._notes.map(el => {
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
    this._notes.map(el => {
      if (el.id === id) {
        updatedNote = el;
        updatedNote.priority = priority;
        return updatedNote;
      }
      return el;
    });
    return updatedNote;
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



  onNoteList(e) {
    const button = e.target.closest('BUTTON');
    if(button.nodeName !== 'BUTTON') {
      return
    }
    if (button.dataset.action === NOTE_ACTIONS.DELETE) {
      this.deleteNote(button.closest('.note-list__item'))

    }
  }

  onOpenEditor() {
    MicroModal.show('note-editor-modal');
  }

}



const generateUniqueId = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15);
