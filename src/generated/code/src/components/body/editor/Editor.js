
import React, { useEffect, useRef } from 'react';
import { MonacoEditor } from 'react-monaco-editor';
import { dialogService } from '../../../../services/dialog_service/DialogService';
import { themeService } from '../../../../services/Theme_service/ThemeService';
import { selectionService } from '../../../../services/Selection_service/SelectionService';
import { projectService } from '../../../../services/project_service/ProjectService';
import { positionTrackingService } from '../../../../services/position-tracking_service/PositionTrackingService';

/**
 * Editor component
 */
function Editor() {
  const editorRef = useRef(null);

  useEffect(() => {
    projectService.subscribe('content-changed', handleContentChanged);
    return () => {
      projectService.unsubscribe('content-changed', handleContentChanged);
    };
  }, []);

  const handleContentChanged = () => {
    if (editorRef.current) {
      editorRef.current.setValue(projectService.getContent());
    }
  };

  const handleDidChangeModelContent = (ev) => {
    try {
      if (!editorRef.current) {
        return;
      }
      projectService.processChanges(ev.changes, editorRef.current.getValue());
    } catch (e) {
      dialogService.showErrorDialog(e);
    }
  };

  const handleDidFocusEditorWidget = () => {
    selectionService.setEditor(editorRef.current);
  };

  const handleDidBlurEditorWidget = () => {
    if (selectionService.getEditor() === editorRef.current) {
      selectionService.setEditor(null);
    }
  };

  const handleDidChangeCursorPosition = (ev) => {
    if (selectionService.getEditor() === editorRef.current) {
      positionTrackingService.updatePosition(ev.position);
    }
  };

  const handleDidChangeCursorSelection = () => {
    if (selectionService.getEditor() === editorRef.current) {
      selectionService.notifySelectionChanged();
    }
  };

  return (
    <MonacoEditor
      ref={editorRef}
      language="markdown"
      theme={themeService.getCurrentTheme()}
      options={{
        fontFamily: themeService.getCurrentFont(),
        fontSize: themeService.getCurrentFontSize(),
      }}
      onChange={handleDidChangeModelContent}
      onFocus={handleDidFocusEditorWidget}
      onBlur={handleDidBlurEditorWidget}
      onCursorPositionChange={handleDidChangeCursorPosition}
      onSelectionChange={handleDidChangeCursorSelection}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default Editor;
