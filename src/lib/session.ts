import { createCookieSessionStorage } from 'solid-start';
import { v4 as uuidv4 } from 'uuid';

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'session',
		sameSite: 'lax',
		path: '/',
		httpOnly: true
	}
});

export const sessionKey = 'solid-key';
