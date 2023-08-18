
import React from 'react';
import { Row } from 'antd';
import UndoService from '../../../services/UndoService/UndoService';
import BuildService from '../../../services/BuildService/BuildService';
import DialogService from '../../../services/DialogService/DialogService';
import ThemeService from '../../../services/ThemeService/ThemeService';
import FileSection from '../file section/FileSection';
import EditSection from '../edit section/EditSection';
import UndoSection from '../undo section/UndoSection';
import BuildSection from '../build section/BuildSection';

/**
 * HomeTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the following child components: FileSection, EditSection, UndoSection, BuildSection.
 */
const HomeTab = () => {
  const theme = ThemeService.getCurrentTheme();

  return (
    <Row className={`home-tab ${theme}`}>
      <FileSection />
      <EditSection />
      <UndoSection />
      <BuildSection />
    </Row>
  );
};

export default HomeTab;
