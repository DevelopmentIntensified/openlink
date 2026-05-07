import { auth } from '$lib/server/auth';

const handler = auth.handler;

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
