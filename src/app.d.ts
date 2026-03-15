import type { User, Session } from 'better-auth/minimal';
import type { Auth } from 'better-auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
			auth: Auth;
		}

		interface PageData {
			user?: User | null;
			session?: Session | null;
		}

		interface LayoutData {
			user?: User | null;
			session?: Session | null;
		}

		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
