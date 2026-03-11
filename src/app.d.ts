/// <reference types="@sveltejs/kit" />
import './app.css';

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionUser | null;
		}
	}
}
