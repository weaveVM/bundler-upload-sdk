import FormData from 'form-data';
import fetch from 'node-fetch';

export class BundlerSDK {
  /**
   * Create a new BundlerSDK instance
   * @param {string} endpoint - The API endpoint URL
   * @param {string} apiKey - The API key for authentication
   */
  constructor(endpoint, apiKey) {
    if (!endpoint) throw new Error('Endpoint is required');
    if (!apiKey) throw new Error('API key is required');

    this.endpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    this.apiKey = apiKey;
  }

  /**
   * Upload one or more files with their associated tags
   * @param {Array<{file: Buffer|Blob|File, tags: Object}>} uploads - Array of file uploads with their tags
   * @returns {Promise<string>} Transaction hash
   * @throws {Error} If the upload fails
   */
  async upload(uploads) {
    if (!Array.isArray(uploads) || uploads.length === 0) {
      throw new Error('At least one file upload is required');
    }

    const formData = new FormData();

    // Add each file and its associated tags
    for (const upload of uploads) {
      if (!upload.file) {
        throw new Error('File is required for each upload');
      }

      formData.append('file', upload.file);

      // Add tags with 'tag_' prefix for this file
      const tags = upload.tags || {};
      for (const [key, value] of Object.entries(tags)) {
        formData.append(`tag_${key}`, value.toString());
      }
    }

    try {
      const response = await fetch(`${this.endpoint}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': this.apiKey,
          ...formData.getHeaders()
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Upload failed with status ${response.status}: ${errorText}`
        );
      }

      const responseText = await response.text();
      // Extract transaction hash from success message
      const match = responseText.match(/Tx Hash: ([^%]+)/);
      if (!match) {
        throw new Error('Could not parse transaction hash from response');
      }

      return match[1];
    } catch (error) {
      if (error.message.includes('Upload failed')) {
        throw error;
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }
}
