const apiUrl = 'http://localhost:3004';

export const loadNotes = () => {
  return fetch(`${apiUrl}/notes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(notes => notes)
    .catch(error => console.log(error));
};

export const addNote = (note) => {
  return fetch(`${apiUrl}/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(note => note)
    .catch(error => console.log(error));
};


export const removeNote = (id) => {
  return fetch(`${apiUrl}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(note => note)
    .catch(error => console.log(error));
};