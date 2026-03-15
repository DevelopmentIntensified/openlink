import { createAuthClient } from 'better-auth/react';
import { env } from '$env/dynamic/public';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_URL ?? env.PUBLIC_ORIGIN
});
