
import React from 'react';
import { Row } from 'antd';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import FileSection from 'MarkdownCode/components/toolbar/home/file section/FileSection';
import EditSection from 'MarkdownCode/components/toolbar/home/edit section/EditSection';
import UndoSection from 'MarkdownCode/components/toolbar/home/undo section/UndoSection';
import BuildSection from 'MarkdownCode/components/toolbar/home/build section/BuildSection';

/**
 * HomeTab component
 * This component is a wrapper that displays its children in a row.
 * It contains the following child components: FileSection, EditSection, UndoSection, BuildSection.
 */
const HomeTab = () => {
  const themeService = new ThemeService();
  const dialogService = new DialogService();
  const theme = themeService.getCurrentTheme();

  return (
    <Row className={`home-tab ${theme}`}>
      <FileSection dialogService={dialogService} themeService={themeService} />
      <EditSection dialogService={dialogService} themeService={themeService} />
      <UndoSection dialogService={dialogService} themeService={themeService} />
      <BuildSection dialogService={dialogService} themeService={themeService} />
    </Row>
  );
};

export default HomeTab;
