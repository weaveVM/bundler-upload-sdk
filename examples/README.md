# Bundler Upload SDK Examples

This directory contains examples of how to use the Bundler Upload SDK in different environments.

## Maskbook Integration Examples

### Browser Compatibility

When using the SDK in a browser environment like Maskbook, you need to:

1. Import the browser version of the SDK:
```javascript
import { BundlerSDK } from 'bundler-upload-sdk/browser';
```

2. Use browser-compatible data types (Blob, File) instead of Node.js types (Buffer):
```javascript
// Instead of:
const file = Buffer.from(data);

// Use:
const file = new Blob([data], { type: 'application/octet-stream' });
```

### Examples:

1. **maskbook-weavevm-agent.js** - A complete example showing how to adapt the WeaveVM agent to use the browser-compatible SDK. The main changes are:
   - Import from `'bundler-upload-sdk/browser'` instead of `'bundler-upload-sdk'`
   - Convert `Uint8Array` data to a `Blob` instead of a `Buffer` before uploading

2. **maskbook-integration.js** - A more generic example showing common patterns for integrating the SDK with browser code, including:
   - File input handling
   - Multiple file uploads
   - Tag management

## Using in Maskbook

To use this SDK in the Maskbook repository:

1. Install the package:
```bash
npm install bundler-upload-sdk
```

2. Update your WeaveVM agent to import the browser version:
```diff
- import { BundlerSDK } from 'bundler-upload-sdk'
+ import { BundlerSDK } from 'bundler-upload-sdk/browser'
```

3. Update your `makePayload` method to use Blob instead of Buffer:
```diff
async makePayload(data: Uint8Array, type: string) {
    this.init()

    try {
        const tags = {
            'Content-Type': type,
            'App-Name': 'Mask-Network',
        }

-       const txHash = await this.bundlerSDK.upload([
-           {
-               file: Buffer.from(data),
-               tags,
-           },
-       ])
+       // Convert Uint8Array to Blob for browser compatibility
+       const blob = new Blob([data], { type })
+       
+       const txHash = await this.bundlerSDK.upload([
+           {
+               file: blob,
+               tags,
+           },
+       ])

        return txHash
    } catch (error) {
        // Error handling...
    }
}
```

That's it! Modern bundlers like Webpack, Rollup, or Parcel will automatically use the browser version of the SDK when bundling for browser environments, but the explicit import ensures compatibility.