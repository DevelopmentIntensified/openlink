import type { ProjectType, ProjectCategory } from '../db/schema';

export interface ProjectFormData {
	name: string;
	description?: string;
	repoUrl?: string;
	website?: string;
	category?: ProjectCategory;
	type: ProjectType;
	isBountyEnabled: boolean;
	ownerId: string;
}

export interface ProjectFormErrors {
	name?: string;
	description?: string;
	repoUrl?: string;
	website?: string;
	category?: string;
	type?: string;
	general?: string;
}

/**
 * Deep module: Validates project form data.
 * Interface: ProjectFormData → { data, errors }
 * Leverage: Callers get validation without knowing rules.
 * Locality: All validation rules in one place.
 */
export function validateProjectForm(formData: FormData): {
	data: Partial<ProjectFormData>;
	errors: ProjectFormErrors;
} {
	const data: Partial<ProjectFormData> = {};
	const errors: ProjectFormErrors = {};

	// Name (required)
	const name = formData.get('name')?.toString().trim() || '';
	if (!name) {
		errors.name = 'Project name is required';
	} else if (name.length < 3) {
		errors.name = 'Project name must be at least 3 characters';
	} else if (name.length > 100) {
		errors.name = 'Project name must be less than 100 characters';
	} else {
		data.name = name;
	}

	// Description (optional)
	const description = formData.get('description')?.toString().trim();
	if (description) {
		data.description = description;
	}

	// Repo URL (optional, must be valid URL if provided)
	const repoUrl = formData.get('repoUrl')?.toString().trim();
	if (repoUrl) {
		try {
			new URL(repoUrl);
			data.repoUrl = repoUrl;
		} catch {
			errors.repoUrl = 'Invalid repository URL';
		}
	}

	// Website (optional, must be valid URL if provided)
	const website = formData.get('website')?.toString().trim();
	if (website) {
		try {
			new URL(website);
			data.website = website;
		} catch {
			errors.website = 'Invalid website URL';
		}
	}

	// Category (optional, must be valid enum)
	const category = formData.get('category')?.toString();
	const validCategories = ['web', 'mobile', 'desktop', 'backend', 'devops', 'data', 'security', 'other'];
	if (category && !validCategories.includes(category)) {
		errors.category = 'Invalid category';
	} else if (category) {
		data.category = category as ProjectCategory;
	}

	// Type (required)
	const type = formData.get('type')?.toString();
	const validTypes = ['individual', 'team', 'community'];
	if (!type || !validTypes.includes(type)) {
		errors.type = 'Valid project type is required';
	} else {
		data.type = type as ProjectType;
	}

	// isBountyEnabled (checkbox)
	data.isBountyEnabled = formData.get('isBountyEnabled') === 'true';

	// ownerId should be set by server from session, not from form data
	// Removed validation here - set in +page.server.ts

	return { data, errors };
}
