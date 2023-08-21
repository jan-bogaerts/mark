
import GptService from '../gpt-service/GptService';
import ResultCacheService from '../result-cache-service/ResultCacheService';

/**
 * CompressService class
 * This service is responsible for compressing text fragments using GPT service.
 * It also uses ResultCacheService to store and track the results.
 */
class CompressService {
  constructor() {
    this.gptService = new GptService();
    this.resultCacheService = new ResultCacheService();
    this.gptInterfaceName = 'compress';
    this.systemMessageContent = `Act as an ai software analyst. You are reviewing the feature description of an application. It is your job to shorten the following text as much as possible and rephrase it in your own words, without loosing any meaning.
    Any text between markdown code blocks (signs) are declarations of constant values, do not change them, but replace with the name of the constant. Remove the markdown, but use bullet points where appropriate.
    compress the following text:`;
  }

  /**
   * Calls the GPT service with the provided text fragment and stores the result in the cache.
   * @param {string} textFragment - The text fragment to process.
   * @returns {Promise<string>} The compressed text.
   */
  async getResult(textFragment) {
    const messages = [
      { role: 'system', content: this.systemMessageContent },
      { role: 'user', content: textFragment },
    ];

    const result = await this.gptService.call(this.gptInterfaceName, messages);
    this.resultCacheService.update(textFragment, result);
    return result;
  }
}

export default CompressService;
