
import React from 'react';
import ThemeService from '../../../services/Theme_service/ThemeService';
import FileSection from './file_section/FileSection';
import EditSection from './edit_section/EditSection';
import UndoSection from './undo_section/UndoSection';
import BuildSection from './build_section/BuildSection';

/**
 * HomeTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the following child components: FileSection, EditSection, UndoSection, BuildSection.
 */
const HomeTab = () => {
  const theme = ThemeService.getCurrentTheme();

  return (
    <div className={`home-tab ${theme}`}>
      <FileSection />
      <EditSection />
      <UndoSection />
      <BuildSection />
    </div>
  );
};

export default HomeTab;
