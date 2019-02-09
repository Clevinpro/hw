const apiUrl = 'http://localhost:3004';

export const addNote = (note) => {
  fetch(`${apiUsel/notes}`, {
    method: 'POST',
    body: JSON.stringify(note),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(post => console.log(post))
    .catch(error => console.log(error));
}