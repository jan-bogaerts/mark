
import ProjectService from '../../project_service/ProjectService';

class LineParserHelpers {
  /**
   * Get the fragment at a specific index.
   * @param {Object} service - The LineParser instance.
   * @param {number} index - The index of the fragment.
   * @returns {Array} - The fragment and its index.
   */
  static getFragmentAt(service, index) {
    let curFragment = service.fragmentsIndex[index];
    while (!curFragment && index >= 0) {
      index -= 1;
      curFragment = service.fragmentsIndex[index];
    }
    if (curFragment && index > 0) {
      while (index > 0 && service.fragmentsIndex[index - 1] === curFragment) {
        index -= 1;
      }
    }
    return [curFragment, index];
  }

  /**
   * Handle the scenario when the line to be parsed is empty.
   * @param {Object} service - The LineParser instance.
   * @param {number} index - The index of the line.
   */
  static handleEmptyLine(service, index) {
    const fragmentsIndexEmpty = service.fragmentsIndex.length === 0 || service.fragmentsIndex.find(t => t === null).length === service.fragmentsIndex.length;
    if (fragmentsIndexEmpty) {
      while (service.fragmentsIndex.length <= index) {
        service.fragmentsIndex.push(null);
      }
    } else {
      const [fragment, fragmentStart] = this.getFragmentAt(service, index);
      if (!fragment) {
        throw new Error('internal error: no fragment found in non empty index table');
      }
      const fragmentLineIndex = index - fragmentStart;
      while (fragment.lines.length < fragmentLineIndex) {
        fragment.lines.push('');
      }
      if (fragment.lines.length > fragmentLineIndex) {
        fragment.lines.splice(fragmentLineIndex, 0, '');
      } else {
        fragment.lines.push('');
      }
    }
  }

  /**
   * Update the fragment title.
   * @param {Object} service - The LineParser instance.
   * @param {Object} fragment - The fragment to update.
   * @param {string} line - The line to parse.
   * @param {number} fragmentPrjIndex - The index of the fragment in the project.
   */
  static updateFragmentTitle(service, fragment, line, fragmentPrjIndex) {
    const oldKey = fragment.key;
    line = line.trim().toLowerCase();
    fragment.depth = line.split('#').length - 1;
    fragment.title = line.replace(/#/g, '');
    fragment.key = service.calculateKey(fragment, fragmentPrjIndex);
    const eventParams = { fragment, oldKey };
    ProjectService.eventTarget.dispatchEvent('key-changed', eventParams);
  }

  /**
   * Remove the fragment title.
   * @param {Object} service - The LineParser instance.
   * @param {Object} fragment - The fragment to remove.
   * @param {number} index - The index of the fragment.
   */
  static removeFragmentTitle(service, fragment, line, index) {
    const [prevFragment, prevIndex] = this.getFragmentAt(service, index - 1);
    if (!prevFragment) {
      fragment.lines.unshift(line);
      const fragmentPrjIndex = ProjectService.textFragments.indexOf(fragment);
      this.updateFragmentTitle(service, fragment, '', fragmentPrjIndex);
    } else {
      prevFragment.lines.push(line);
      for (let l of fragment.lines) {
        prevFragment.lines.push(l);
      }
      while (service.fragmentsIndex[index] === fragment) {
        service.fragmentsIndex[index] = prevFragment;
      }
      ProjectService.deleteTextFragment(fragment);
      ProjectService.markOutOfDate(prevFragment);
    }
  }

  /**
   * Insert a new fragment.
   * @param {Object} service - The LineParser instance.
   * @param {Object} fragment - The fragment to insert.
   * @param {number} fragmentStart - The start index of the fragment.
   * @param {string} line - The line to parse.
   * @param {number} fragmentPrjIndex - The index of the fragment in the project.
   * @param {number} index - The index of the line.
   */
  static insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index) {
    const toAdd = service.createTextFragment(line, fragmentPrjIndex);
    service.fragmentsIndex[index] = toAdd;
    const fragmentLineIndex = index - fragmentStart;
    while (fragmentLineIndex > 0) {
      toAdd.lines.unshift(fragment.lines.pop());
      service.fragmentsIndex[index + fragmentLineIndex] = toAdd;
    }
    ProjectService.markOutOfDate(fragment);
  }

  /**
   * Handle the scenario when the line to be parsed starts with a '#'.
   * @param {Object} service - The LineParser instance.
   * @param {string} line - The line to parse.
   * @param {number} index - The index of the line.
   */
  static handleTitleLine(service, line, index) {
    if (service.fragmentsIndex.length === 0 || service.fragmentsIndex.length < index || service.fragmentsIndex[index] === null) {
      const toAdd = service.createTextFragment(line, ProjectService.textFragments.length);
      while (service.fragmentsIndex.length < index) {
        service.fragmentsIndex.push(null);
      }
      service.fragmentsIndex.push(toAdd);
    } else {
      const [fragment, fragmentStart] = this.getFragmentAt(service, index);
      if (!fragment) {
        throw new Error('internal error: no fragment found in non empty index table');
      }
      const fragmentPrjIndex = ProjectService.textFragments.indexOf(fragment);
      if (fragmentStart === index) {
        this.updateFragmentTitle(service, fragment, line, fragmentPrjIndex);
      } else {
        this.insertFragment(service, fragment, fragmentStart, line, fragmentPrjIndex, index);
      }
    }
  }

  /**
   * Update the fragment lines.
   * @param {Object} service - The LineParser instance.
   * @param {Object} fragment - The fragment to update.
   * @param {number} index - The index of the line.
   * @param {number} fragmentStart - The start index of the fragment.
   */
  static updateFragmentLines(service, fragment, line, index, fragmentStart) {
    const fragmentLineIndex = index - fragmentStart;
    if (fragmentLineIndex < fragment.lines.length) {
      fragment.lines[fragmentLineIndex] = line;
    } else {
      while (fragment.lines.length < fragmentLineIndex) {
        service.fragmentsIndex[fragmentStart + fragment.lines.length] = fragment;
        fragment.lines.push('');
      }
      fragment.lines.push(line);
      service.fragmentsIndex[index] = fragment;
      ProjectService.markOutOfDate(fragment);
    }
  }

  /**
   * Handle the scenario when the line to be parsed is a regular line.
   * @param {Object} service - The LineParser instance.
   * @param {string} line - The line to parse.
   * @param {number} index - The index of the line.
   */
  static handleRegularLine(service, line, index) {
    const [fragment, fragmentStart] = this.getFragmentAt(service, index);
    if (!fragment) {
      const toAdd = service.createTextFragment('', 0);
      while (service.fragmentsIndex.length < index) {
        service.fragmentsIndex.push(null);
      }
      service.fragmentsIndex.push(toAdd);
    } else if (fragmentStart === index) {
      this.removeFragmentTitle(service, fragment, line, index);
    } else {
      this.updateFragmentLines(service, fragment, line, index, fragmentStart);
    }
  }
}

export default LineParserHelpers;
