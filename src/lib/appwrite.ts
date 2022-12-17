import { Account, Client, Databases } from 'appwrite';
const { VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID } = import.meta.env;
console.log(VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID);

export const client = new Client()
	.setEndpoint(VITE_APPWRITE_ENDPOINT)
	.setProject(VITE_APPWRITE_PROJECT_ID);
export const databases = new Databases(client);
export const account = new Account(client);

export enum AppwriteExceptionType {
	'INVALID_CREDENTIALS' = 'user_invalid_credentials'
}
