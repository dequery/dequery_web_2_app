import React from 'react';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function AnswerEditor(props) {
  return (
    <Editor
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      editorState={props.editorState}
      onEditorStateChange={props.onEditorStateChange}
      editorStyle={{ height: '300px', width: '100%', border: '1px solid black', padding: '10px' }}
    />
  );
}

export default AnswerEditor;
