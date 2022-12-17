import { v4 as uuidv4 } from 'uuid';

export const getSession = (cookies: any) => {
	let session = cookies.get('sessionKey');
	if (!session) {
		session = uuidv4();
		cookies.set('sessionKey', session);
	}

	return session;
};
