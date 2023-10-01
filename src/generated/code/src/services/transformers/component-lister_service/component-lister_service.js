
import resources from '../../../resources.json';
import TransformerBaseService from '../../transformer-base_service/TransformerBaseService';
import projectService from '../../project_service/ProjectService';

/**
 * ComponentListerService class
 * Inherits from TransformerBaseService
 * Responsible for extracting all the component names it can find in a text
 */
class ComponentListerService extends TransformerBaseService {
  /**
   * Constructor for ComponentListerService
   * @param {string} name - name of the service
   * @param {Array} dependencies - array of dependencies
   * @param {boolean} isJson - flag to check if the output is JSON
   */
  constructor(name = 'components', dependencies = [], isJson = true) {
    super(name, dependencies, isJson);
  }

  /**
   * Builds a message from a text fragment
   * @param {Object} textFragment - text fragment to build the message from
   * @returns {Array} - array of messages and keys
   */
  buildMessage(textFragment) {
    if (projectService.textFragments.indexOf(textFragment) < 2) return null;

    const result = [
      {
        role: 'system',
        content: resources.MarkdownCode_services_transformers_component_lister_service_0
          .replace('dev_stack_title', projectService.textFragments[1]?.title)
          .replace('dev_stack_title', projectService.textFragments[1]?.lines.join('\n')),
      },
      {
        role: 'user',
        content: resources.MarkdownCode_services_transformers_component_lister_service_1
          .replace('title', textFragment.title)
          .replace('content', textFragment.lines.join('\n')),
      },
      {
        role: 'assistant',
        content: resources.MarkdownCode_services_transformers_component_lister_service_2,
      },
    ];

    if (projectService.textFragments.length >= 1) {
      return [result, [textFragment.key, projectService.textFragments[1].key]];
    } else {
      return [result, [textFragment.key]];
    }
  }
}

export default ComponentListerService;
