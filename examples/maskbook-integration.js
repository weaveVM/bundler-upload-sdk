/**
 * Example integration with Maskbook for WeavVM bundler
 * 
 * This is a simplified example showing how to use the bundler-upload-sdk
 * in a browser environment such as the Maskbook extension.
 */

import { BundlerSDK } from 'bundler-upload-sdk/browser';

/**
 * Example WeavVM Bundler Feature integration for Maskbook
 */
export class WeavVMBundlerService {
  constructor(endpoint, apiKey) {
    this.bundlerSDK = new BundlerSDK(endpoint, apiKey);
  }

  /**
   * Upload a file to the WeavVM bundler
   * 
   * @param {File|Blob} file - The file to upload
   * @param {Object} tags - Tags to associate with the file
   * @returns {Promise<string>} - Transaction hash
   */
  async uploadFile(file, tags = {}) {
    try {
      // Ensure we have content type in tags
      if (!tags['content-type'] && file.type) {
        tags['content-type'] = file.type;
      }

      // If file is a File object and doesn't have filename tag
      if (!tags['filename'] && file instanceof File) {
        tags['filename'] = file.name;
      }

      // Add Maskbook specific tags if needed
      tags['uploaded-from'] = 'Maskbook';

      // Upload the file using the browser-compatible SDK
      const txHash = await this.bundlerSDK.upload([
        {
          file,
          tags
        }
      ]);

      return txHash;
    } catch (error) {
      console.error('WeavVM bundler upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files in a single transaction
   * 
   * @param {Array<{file: File|Blob, tags: Object}>} files - Array of files with their tags
   * @returns {Promise<string>} - Transaction hash
   */
  async uploadMultipleFiles(files) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('At least one file is required');
    }

    // Prepare uploads with proper tags
    const uploads = files.map(({ file, tags = {} }) => {
      // Add default tags if not provided
      if (!tags['content-type'] && file.type) {
        tags['content-type'] = file.type;
      }

      if (!tags['filename'] && file instanceof File) {
        tags['filename'] = file.name;
      }

      tags['uploaded-from'] = 'Maskbook';

      return { file, tags };
    });

    // Upload all files in a single transaction
    try {
      const txHash = await this.bundlerSDK.upload(uploads);
      return txHash;
    } catch (error) {
      console.error('WeavVM bundler multi-upload failed:', error);
      throw error;
    }
  }
}

/**
 * Example usage in a Maskbook component
 */
function WeavVMBundlerUploadButton() {
  // This would need to be properly initialized with your bundler endpoint and API key
  const weavVMService = new WeavVMBundlerService(
    'https://your-bundler-endpoint.com',
    'your-api-key'
  );

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // For a single file
      if (files.length === 1) {
        const txHash = await weavVMService.uploadFile(files[0], {
          'content-type': files[0].type,
          'filename': files[0].name,
          // Additional tags as needed
          'description': 'Uploaded from Maskbook WeavVM feature'
        });
        console.log('File uploaded successfully! Transaction hash:', txHash);
      } 
      // For multiple files
      else {
        const uploads = Array.from(files).map(file => ({
          file,
          tags: {
            'content-type': file.type,
            'filename': file.name,
            'description': 'Uploaded from Maskbook WeavVM feature'
          }
        }));

        const txHash = await weavVMService.uploadMultipleFiles(uploads);
        console.log('Files uploaded successfully! Transaction hash:', txHash);
      }

      // You could then update the UI or store the transaction hash
    } catch (error) {
      console.error('Upload failed:', error.message);
      // Handle error in the UI
    }
  };

  // Example of how this might be used in a React component in Maskbook
  return `
    <!-- This would be JSX in a React component -->
    <div>
      <h3>Upload to WeavVM Bundler</h3>
      <input type="file" multiple onChange={handleFileUpload} />
    </div>
  `;
}