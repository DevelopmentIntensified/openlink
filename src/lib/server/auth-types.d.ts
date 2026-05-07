import type { User } from 'better-auth';

declare module 'better-auth' {
  interface User {
    roles?: string[];
    bio?: string;
    skills?: string[];
    githubUrl?: string;
    onboardingComplete?: boolean;
    companyName?: string;
    companyWebsite?: string;
    companyDescription?: string;
  }
}
