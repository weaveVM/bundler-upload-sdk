declare module "bundler-upload-sdk" {
	export class BundlerSDK {
		endpoint: string
		apiKey: string

		/**
		 * Create a new BundlerSDK instance
		 * @param endpoint - The API endpoint URL
		 * @param apiKey - The API key for authentication
		 */
		constructor(endpoint: string, apiKey: string)

		/**
		 * Upload one or more files with their associated tags
		 * @param uploads - Array of file uploads with their tags
		 * @returns Transaction hash
		 * @throws {Error} If the upload fails
		 */
		upload(
			uploads: Array<{
				file: Buffer | Blob | File
				tags?: Record<string, string | number | boolean>
			}>
		): Promise<string>
	}
}
