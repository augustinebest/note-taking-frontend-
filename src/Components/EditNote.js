import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withRouter } from 'react-router-dom';
import { notify } from "react-notify-toast";
import gql from 'graphql-tag';
import '../App.css'

const NOTE_QUERY = gql `
  query getNote($_id: ID!){
    getNote(_id: $_id) {
      _id
      title
      content
      date
    }
  }
`

const UPDATE_NOTE = gql `
  mutation updateNote($_id: ID!, $title: String, $content: String) {
    updateNote(_id: $_id, input: {title: $title, content: $content}) {
      _id
      title
      content
    }
  }
`

const EditNote = withRouter(({ match, history }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { loading, error, data } = useQuery(NOTE_QUERY, {
    variables: {
      _id: match.params.id
    }
  })

  const [updateNote] = useMutation(UPDATE_NOTE);

  if(loading) return <div>Fetching note...</div>
  if(error) return <div>Error Fetching note</div>

  const note = data;
  console.log(note)
  return (
    <div className="container m-t-20 cont">
      <h1 style={{marginTop: '35px'}} className="page-title">Edit Note</h1>
​
      <div className="newnote-page m-t-20">
        <form onSubmit={e => {
          e.preventDefault();
          updateNote({
            variables: {
              _id: note.getNote._id,
              title: title ? title : note.getNote.title,
              content: content ? content : note.getNote.content
            }
          })
          notify.show("Note was edited successfully", "success");
          history.push('/')
        }}>
          <div className="field">
            <label className="label">Note Title</label>
            <div className="control">
              <input className="input" 
                type="text" 
                placeholder="Note Title" 
                defaultValue={note.getNote.title}
                required
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>
​
          <div className="field">
            <label className="label">Note Content</label>
            <div className="control">
              <textarea
                className="textarea"
                rows="10"
                placeholder="Note Content here..."
                defaultValue={note.getNote.content}
                required
                onChange={e => setContent(e.target.value)}
              ></textarea>
            </div>
          </div>
​
          <div className="field">
            <div className="control">
              <button className="button is-link">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
})
export default EditNote;