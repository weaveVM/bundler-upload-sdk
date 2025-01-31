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
const bundler = new BundlerSDK('https://your-api-endpoint', 'your-api-key');

// Upload a file without tags
try {
  const txHash = await bundler.upload(fileBuffer);
  console.log('Upload successful! Transaction hash:', txHash);
} catch (error) {
  console.error('Upload failed:', error.message);
}

// Upload a file with tags
try {
  const txHash = await bundler.upload(fileBuffer, {
    contentType: 'image/jpeg',
    category: 'photos',
    userId: '123'
  });
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

### `upload(file, tags?)`

Uploads a file with optional tags.

- `file` (Buffer|Blob|File): The file to upload
- `tags` (Object, optional): Key-value pairs of tags to attach to the file
- Returns: Promise<string> - Resolves with the transaction hash
- Throws: Error if the upload fails or network error occurs

## Error Handling

The SDK throws errors in the following cases:
- Missing required parameters (endpoint, apiKey, file)
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
