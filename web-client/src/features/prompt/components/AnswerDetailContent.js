import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function AnswerDetailContent(props) {
  return (
    <Editor
      toolbarHidden={true}
      readOnly={true}
      editorState={EditorState.createWithContent(convertFromRaw(props.content))}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      editorStyle={{minHeight: '300px', border: '1px solid black', padding: '10px', borderRadius: '4px'}}
    />
  );
}

export default AnswerDetailContent;
