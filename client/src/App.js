import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/Header";
import InputForm from "./components/inputForm/InputForm";
import NoteCard from "./components/noteCard/NoteCard";
import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [isReload, setIsReload] = useState([false]);

  useEffect(() => {
    fetch(`http://localhost:5000/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, [isReload]);
  /*
1. here there will be a function named handleSearch
to handle search by query, and it will be passed as props to header

  */ const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.name.value;
    if (query) {
      fetch(`http://localhost:5000/notes?name=${query}`)
        .then((res) => res.json())
        .then((data) => setNotes(data));
    }
  };

  /*2. here there will be a function named handleDelete
to delete a note, and it will be passed as props to NoteCard that will be triggered using delete button.
 */
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/note/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => setIsReload(!isReload));
  };
  /*
3. there will be a function named handleUpdate
    to update data, and it will be passed as props to NoteCard and 
   later it will be passed to Update modal using props.
 */

  const handleUpdate = (id, name, note) => {
    // console.log(id,name,note);
    fetch(`http://localhost:5000/note/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, note }),
    })
      .then((response) => response.json())
      .then((json) => setIsReload(!isReload));
  };

  /*
4.  there will be a function named handlePost
to post data to backend, and it will be passed as props to InputFrom.
 */

  const handlePost = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const note = event.target.note.value;
    console.log({ name, note });
    fetch("http://localhost:5000/note", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name, note }),
    })
      .then((response) => response.json())
      .then((json) => setIsReload(!isReload));
  };

  return (
    <div className="App">
      <Header handleSearch={handleSearch} />
      <InputForm handlePost={handlePost} />
      <div className="row row-cols-1 row-cols-md-3 g-4 m-2">
        {notes.map((note) => (
          <NoteCard handleUpdate={handleUpdate} handleDelete={handleDelete} note={note} />
        ))}
      </div>
    </div>
  );
}

export default App;
