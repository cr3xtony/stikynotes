import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Container, FormControl, FormGroup } from 'react-bootstrap';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [allnotes, setAllNotes] = useState('');
  const [color, setColor] = useState('#F9F912');
  const [date, setDate] = useState('');
  const [noteText, setNoteText] = useState('');
  const characterLimit = 200;

  //dateGenerator
  const dateString = (date) => {
    let [m, d, y] = new Date(date).toLocaleDateString('en-US').split('/');

    if (m.length == 1) {
      m = `0${m}`;
    }
    if (d.length == 1) {
      d = `0${d}`;
    }
    let newdate = `${y}-${m}-${d}`;
    return newdate;
  };
  const dateGenerator = (date) => {
    var dateObj = new Date(date);
    var month = dateObj.toLocaleString('default', { month: 'long' }); //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    let newdate = `${month} ${day}, ${year}`;
    return newdate;
  };

  //for handle drag
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNotes(items);
  };
  //for handling all notes button
  const allNotesHandler = () => {
    if (allnotes === '') {
      setNotes(notes);
    } else {
      setNotes(allnotes);
    }
  };
  //for handling toggle star
  const starHandler = (id) => {
    const newNotes = notes.filter((note) => note.id === id);

    if (newNotes[0].star === false) {
      const newnotes = notes.map((note) =>
        note.id === id ? { ...note, star: true } : note
      );
      setNotes(newnotes);
    } else {
      const newnotes = notes.map((note) =>
        note.id === id ? { ...note, star: false } : note
      );
      setNotes(newnotes);
    }
  };

  //for handling starred button
  const starredHandler = () => {
    setAllNotes(notes);
    const notefilter = notes.filter((note) => note.star === true);
    setNotes(notefilter);
  };

  //for handling create note button
  const createNote = (e) => {
    var dateObj = new Date();
    var month = dateObj.toLocaleString('default', { month: 'long' }); //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    const newdate = `${month} ${day}, ${year}`;
    setDate(newdate);
    const newNote = {
      text: 'Click the edit button to create your note',
      id: uuidv4(),
      star: false,
      setEdit: false,
      date: newdate,
      color: '#F9F912',
    };
    setNotes([...notes, newNote]);
  };

  //for color changing
  const styles = {
    backgroundColor: color,
  };
  //for textArea
  const handleChange = (e) => {
    if (characterLimit - e.target.value.length >= 0) {
      setNoteText(e.target.value);
    }
  };

  //set Editing or not
  const handleEdit = (id) => {
    setDate('');
    setNoteText('');
    const result = notes.filter((note) => note.id === id);
    if (result[0].text !== 'Click the edit button to create your note') {
      setNoteText(result[0].text);
    }
    setDate(dateString(result[0].date));
    setColor(result[0].color);
    const newnotes = notes.map((note) => {
      if (note.setEdit === true) {
        note.setEdit = false;
      }
      return note.id === id ? { ...note, setEdit: true } : note;
    });
    setNotes(newnotes);
  };

  //note delete handler
  const deleteHandler = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  //after edit saving note
  const saveHandler = (id) => {
    const newnotes = notes.map((note) =>
      note.id === id
        ? { ...note, text: noteText, date: date, color: color, setEdit: false }
        : note
    );
    setNotes(newnotes);
    setNoteText('');
  };

  //button cancel Handler
  const cancelHandler = (id) => {
    const newnotes = notes.map((note) =>
      note.id === id ? { ...note, setEdit: false } : note
    );
    setNotes(newnotes);
    setNoteText('');
  };

  return (
    <Container>
      <div className="body">
        <div className="header">
          <div className="btn-left">
            <button onClick={allNotesHandler}>All Notes</button>
            <button onClick={starredHandler}>Starred</button>
          </div>
          <div className="btn-right">
            <button onClick={createNote}>Create Note</button>
          </div>
        </div>
      </div>

      <div className="card-item">
        {notes ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="notes" direction="horizontal">
              {(provided) => (
                <ul
                  style={{ display: 'flex', flexWrap: 'wrap' }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {notes.map((note, index) =>
                    note.setEdit ? (
                      <Draggable
                        key={note.id}
                        draggableId={note.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div className="card" style={styles}>
                              <div className="note-new">
                                <textarea
                                  rows="8"
                                  cols="10"
                                  placeholder="Type to add a note..."
                                  value={noteText}
                                  onChange={handleChange}
                                ></textarea>
                                <div className="note-footer-new">
                                  <div style={{ marginBottom: '10px' }}>
                                    {noteText
                                      ? characterLimit - noteText.length
                                      : characterLimit - 0}{' '}
                                    Remaining
                                  </div>

                                  <FormGroup
                                    className="date"
                                    controlId="date"
                                    bsSize="large"
                                  >
                                    <FormControl
                                      autoFocus
                                      type="date"
                                      value={date}
                                      onChange={(e) => setDate(e.target.value)}
                                    />
                                  </FormGroup>
                                  <span>Set Color </span>

                                  <div className="colors">
                                    <div
                                      style={{
                                        backgroundColor: '#FFBF00',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                      }}
                                      onClick={() => {
                                        setColor('#FFBF00');
                                      }}
                                    >
                                      {' '}
                                    </div>

                                    <div
                                      style={{
                                        backgroundColor: '#FF7F50',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                      }}
                                      onClick={() => {
                                        setColor('#FF7F50');
                                      }}
                                    ></div>

                                    <div
                                      style={{
                                        backgroundColor: '#DE3163',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                      }}
                                      onClick={() => {
                                        setColor('#DE3163');
                                      }}
                                    ></div>

                                    <div
                                      style={{
                                        backgroundColor: '#40E0D0',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                        marginRight: '5px',
                                      }}
                                      onClick={() => {
                                        setColor('#40E0D0');
                                      }}
                                    ></div>

                                    <div
                                      style={{
                                        backgroundColor: '#6495ED',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                      }}
                                      onClick={() => {
                                        setColor('#6495ED');
                                      }}
                                    ></div>

                                    <div
                                      style={{
                                        backgroundColor: '#CCCCFF',
                                        cursor: 'pointer',
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '2px',
                                      }}
                                      onClick={() => {
                                        setColor('#CCCCFF');
                                      }}
                                    ></div>
                                  </div>
                                  <div className="save-cancel">
                                    <button
                                      className="save"
                                      onClick={() => saveHandler(note.id)}
                                    >
                                      Save
                                    </button>

                                    <button
                                      className="save"
                                      onClick={() => cancelHandler(note.id)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ) : (
                      <Draggable
                        key={note.id}
                        draggableId={note.id}
                        index={index}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: note.color }}
                            >
                              <span
                                onClick={() => starHandler(note.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                {note.star ? (
                                  <i className="fas fa-star"></i>
                                ) : (
                                  <i className="far fa-star"></i>
                                )}
                              </span>
                              <span>{note.text}</span>
                              <div className="note-footer">
                                <span>{note.date}</span>

                                <div className="card-footer">
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    className="button"
                                    onClick={() => handleEdit(note.id)}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </span>
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    className="button"
                                    onClick={() => deleteHandler(note.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    )
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <> No notes found </>
        )}
      </div>
    </Container>
  );
};

export default Notes;
