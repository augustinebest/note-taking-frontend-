import React from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Link } from "react-router-dom";
import '../App.css';

const DELETE_NOTE_QUERY = gql `
  mutation deleteNote($_id: ID!) {
    deleteNote(_id: $_id) {
      title
      content
      _id
    }
  }
`

const NOTES_QUERY = gql`
    {
        allNotes {
            title
            content
            _id
            date
        }
    }
`

const AllNotes = () => {
  const { loading, error, data } = useQuery(NOTES_QUERY);
  const [deleteNote] = useMutation(DELETE_NOTE_QUERY, {
    update (
      cache,
      {
        data: { deleteNote }
      }
    ) {
      const { allNotes } = cache.readQuery({query: NOTES_QUERY})
      const newNotes = allNotes.filter(note => note._id !== deleteNote._id)
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { allNotes: newNotes }
      })
    }
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log(data.allNotes)
  return (
    <div className="container m-t-20 cont">
      <h1 style={{marginTop: '35px'}} className="page-title">All Notes</h1><div className="allnotes-page">
        <div className="columns is-multiline">
          {data.allNotes.length > 0
            ? data.allNotes.map(note => (
                <div className="column is-one-third" key={note._id}>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">{note.title}</p>
                    </header>
                    <div className="card-content">
                      <div className="content">
                            {note.content}
                        <br />
                      </div>
                    </div>
                    <footer className="card-footer">
                      <Link to={`note/${note._id}`} className="card-footer-item">
                        Edit
                      </Link>
                      <a href="#" className="card-footer-item"
                        onClick={e=> {
                          e.preventDefault();
                          deleteNote({
                            variables: {
                              _id: note._id
                            }
                          })
                        }}
                      >
                        Delete
                      </a>
                    </footer>
                  </div>
                </div>
              ))
            : "No Notes yet"}
        </div>
      </div>
    </div>
  );
}
export default AllNotes;