
import React, { useEffect, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import dialogService from '../../../services/dialog_service/DialogService';
import themeService from '../../../services/Theme_service/ThemeService';
import selectionService from '../../../services/Selection_service/SelectionService';
import changeProcessorService from '../../../services/project_service/change-processor_service/ChangeProcessorService';
import projectService from '../../../services/project_service/ProjectService';

/**
 * Editor component
 */
function Editor() {
  const editorRef = useRef(null);


  useEffect(() => {
    const handleContentChanged = () => {
      const content = projectService.content;
      if (editorRef.current) {
        editorRef.current.setValue(content);
      }
    };

    projectService.eventTarget.addEventListener('content-changed', handleContentChanged);
    return () => {
      projectService.eventTarget.removeEventListener('content-changed', handleContentChanged);
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent((ev) => {
      try {
        if (!editor) return;
        changeProcessorService.process(ev.changes, editor);
      } catch (e) {
        dialogService.showErrorDialog(e);
      }
    });

    editor.onDidFocusEditorWidget(() => {
      selectionService.setEditor(editor);
    });

    editor.onDidBlurEditorWidget(() => {
      if (selectionService.getEditor() === editor) {
        selectionService.setEditor(null);
      }
    });

    editor.onDidChangeCursorPosition((ev) => {
      if (selectionService.getEditor() === editor) {
   //     positionTrackingService.updatePosition(ev.position);
      }
    });

    editor.onDidChangeCursorSelection(() => {
      if (selectionService.getEditor() === editor) {
        selectionService.notifySubscribers();
      }
    });
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    // `cursorStyle: 'line',
    automaticLayout: true,
    theme: themeService.getCurrentTheme(),
    fontFamily: themeService.getCurrentFont(),
    fontSize: themeService.getCurrentFontSize(),
  };

  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language="markdown"
      value={projectService.content}
      options={options}
      editorDidMount={handleEditorDidMount}
      className="editor"
    />
  );
}

export default Editor;
