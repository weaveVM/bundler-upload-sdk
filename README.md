# Bundler SDK

A JavaScript SDK for interacting with the Bundler upload service.

## Installation

```bash
npm install bundler-upload-sdk
```

## Usage

```javascript
import { BundlerSDK } from 'bundler-upload-sdk';

// Initialize the SDK with your endpoint and API key
const bundler = new BundlerSDK('http://127.0.0.1:8000', 'your-api-key');

// Upload multiple files with their associated tags
try {
  const txHash = await bundler.upload([
    {
      file: paperFileBuffer,
      tags: {
        'content-type': 'text/plain',
        'filename': 'paper.txt'
      }
    },
    {
      file: woodFileBuffer,
      tags: {
        'content-type': 'text/plain',
        'filename': 'wood.txt'
      }
    }
  ]);
  console.log('Upload successful! Transaction hash:', txHash);
} catch (error) {
  console.error('Upload failed:', error.message);
}

// Upload a single file with tags
try {
  const txHash = await bundler.upload([
    {
      file: fileBuffer,
      tags: {
        'content-type': 'image/jpeg',
        'category': 'photos',
        'userId': '123'
      }
    }
  ]);
  console.log('Upload successful! Transaction hash:', txHash);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## API Reference

### `new BundlerSDK(endpoint, apiKey)`

Creates a new BundlerSDK instance.

- `endpoint` (string): The API endpoint URL
- `apiKey` (string): The API key for authentication

### `upload(uploads)`

Uploads one or more files with their associated tags.

- `uploads` (Array): An array of upload objects, each containing:
  - `file` (Buffer|Blob|File): The file to upload
  - `tags` (Object, optional): Key-value pairs of tags to attach to the file
- Returns: Promise<string> - Resolves with the transaction hash
- Throws: Error if the upload fails or network error occurs

Example curl command equivalent to the SDK usage:
```bash
curl -X POST http://127.0.0.1:8000/upload \
  -H "Authorization: your-api-key" \
  -F "file=@paper.txt" \
  -F "tag_content-type=text/plain" \
  -F "tag_filename=paper.txt" \
  -F "file=@wood.txt" \
  -F "tag_content-type=text/plain" \
  -F "tag_filename=wood.txt"
```

## Error Handling

The SDK throws errors in the following cases:
- Missing required parameters (endpoint, apiKey)
- Empty uploads array or missing files
- Network errors during upload
- Server errors (non-200 responses)
- Invalid or missing API key
- Malformed server response

## Development

This SDK uses:
- `form-data` for handling multipart form data uploads
- `node-fetch` for making HTTP requests

## License

MIT
