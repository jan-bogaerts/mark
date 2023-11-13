import LineParserHelpers from './LineParserHelpers';
import ProjectService from '../../project_service/ProjectService';

jest.mock('../../project_service/ProjectService');

describe('LineParserHelpers', () => {
  let service;
  let fragment;
  let index;

  beforeEach(() => {
    service = {
      fragmentsIndex: [],
      createTextFragment: jest.fn(),
      calculateKey: jest.fn(),
    };
    fragment = {
      lines: [],
      key: 'key',
      depth: 0,
      title: 'title',
    };
    index = 0;
  });

  describe('getFragmentAt', () => {
    it('should return the correct fragment and index', () => {
      service.fragmentsIndex = [null, null, fragment];
      const result = LineParserHelpers.getFragmentAt(service, 2);
      expect(result).toEqual([fragment, 2]);
    });
  });

  describe('handleEmptyLine', () => {
    it('should handle an empty line correctly', () => {
      service.fragmentsIndex = [null, null, null];
      LineParserHelpers.handleEmptyLine(service, 2);
      expect(service.fragmentsIndex).toEqual([null, null, null]);
    });
  });

  describe('updateFragmentTitle', () => {
    it('should update the fragment title correctly', () => {
      const line = '## new title';
      LineParserHelpers.updateFragmentTitle(service, fragment, line, index);
      expect(fragment.depth).toEqual(2);
      expect(fragment.title).toEqual('new title');
      expect(service.calculateKey).toHaveBeenCalledWith(fragment, index);
    });
  });

  describe('removeFragmentTitle', () => {
    it('should remove the fragment title correctly', () => {
      service.fragmentsIndex = [fragment, fragment];
      LineParserHelpers.removeFragmentTitle(service, fragment, 'line', index);
      expect(ProjectService.deleteTextFragment).toHaveBeenCalledWith(fragment);
    });
  });

  describe('insertFragment', () => {
    it('should insert a fragment correctly', () => {
      const line = 'line';
      const fragmentStart = 0;
      const fragmentPrjIndex = 0;
      LineParserHelpers.insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index);
      expect(service.createTextFragment).toHaveBeenCalledWith(line, fragmentPrjIndex);
    });
  });

  describe('isInCode', () => {
    it('should return true if the fragment is in code', () => {
      fragment.lines = ['```', 'code', '```'];
      const result = LineParserHelpers.isInCode(fragment);
      expect(result).toBe(false);
    });
  });

  describe('handleTitleLine', () => {
    it('should handle a title line correctly', () => {
      const line = '# title';
      LineParserHelpers.handleTitleLine(service, line, index);
      expect(service.createTextFragment).toHaveBeenCalledWith(line, ProjectService.textFragments.length);
    });
  });

  describe('updateFragmentLines', () => {
    it('should update the fragment lines correctly', () => {
      const line = 'line';
      const fragmentStart = 0;
      LineParserHelpers.updateFragmentLines(service, fragment, line, index, fragmentStart);
      expect(fragment.lines).toEqual([line]);
    });
  });

  describe('handleRegularLine', () => {
    it('should handle a regular line correctly', () => {
      const line = 'line';
      LineParserHelpers.handleRegularLine(service, line, index);
      expect(service.createTextFragment).toHaveBeenCalledWith('', 0);
    });
  });

  describe('deleteLine', () => {
    it('should delete a line correctly', () => {
      service.fragmentsIndex = [fragment, fragment];
      LineParserHelpers.deleteLine(service, index);
      expect(fragment.lines).toEqual([]);
    });
  });
});