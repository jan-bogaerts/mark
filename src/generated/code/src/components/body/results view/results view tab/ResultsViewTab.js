
import React, { useEffect, useState } from 'react';
import { MonacoEditor } from 'react-monaco-editor';
import { ResultCacheService } from '../../../../services/result-cache_service/ResultCacheService';
import { ThemeService } from '../../../../services/Theme_service/ThemeService';
import { SelectionService } from '../../../../services/Selection_service/SelectionService';
import { PositionTrackingService } from '../../../../services/position-tracking_service/PositionTrackingService';
import { DialogService } from '../../../../services/dialog_service/DialogService';
import ResultsViewContextMenu from '../results-view-context-menu/ResultsViewContextMenu';

/**
 * ResultsViewTab component
 * @param {Object} props - Component properties
 */
const ResultsViewTab = (props) => {
  const { transformer } = props;
  const [editorText, setEditorText] = useState('');
  const [editorTheme, setEditorTheme] = useState(ThemeService.getCurrentTheme());
  const [editorFont, setEditorFont] = useState(ThemeService.getCurrentFont());
  const [editorFontSize, setEditorFontSize] = useState(ThemeService.getCurrentFontSize());
  const [editorKey, setEditorKey] = useState(null);

  useEffect(() => {
    const updateEditorText = () => {
      const result = ResultCacheService.getResult(transformer, editorKey);
      setEditorText(result.text);
    };

    const updateEditorTheme = () => {
      setEditorTheme(ThemeService.getCurrentTheme());
      setEditorFont(ThemeService.getCurrentFont());
      setEditorFontSize(ThemeService.getCurrentFontSize());
    };

    const updateEditorKey = () => {
      const newKey = PositionTrackingService.getCurrentKey();
      setEditorKey(newKey);
      updateEditorText();
    };

    updateEditorText();
    updateEditorTheme();
    updateEditorKey();

    ThemeService.subscribe(updateEditorTheme);
    PositionTrackingService.subscribe(updateEditorKey);
    ResultCacheService.subscribe(updateEditorText);

    return () => {
      ThemeService.unsubscribe(updateEditorTheme);
      PositionTrackingService.unsubscribe(updateEditorKey);
      ResultCacheService.unsubscribe(updateEditorText);
    };
  }, [editorKey]);

  const handleEditorChange = (newValue) => {
    ResultCacheService.setResult(transformer, editorKey, newValue);
  };

  const handleEditorFocus = (editor) => {
    SelectionService.setEditor(editor);
  };

  const handleEditorBlur = () => {
    if (SelectionService.getEditor() === editor) {
      SelectionService.setEditor(null);
    }
  };

  const handleEditorSelectionChange = () => {
    if (SelectionService.getEditor() === editor) {
      SelectionService.notifySubscribers();
    }
  };

  return (
    <div className="results-view-tab">
      <ResultsViewContextMenu transformer={transformer} key={editorKey} />
      <MonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme={editorTheme}
        value={editorText}
        options={{
          fontFamily: editorFont,
          fontSize: editorFontSize,
        }}
        onChange={handleEditorChange}
        editorDidMount={handleEditorFocus}
        editorWillUnmount={handleEditorBlur}
        onSelectionChange={handleEditorSelectionChange}
      />
    </div>
  );
};

export default ResultsViewTab;
