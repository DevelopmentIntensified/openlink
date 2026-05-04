import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createProject } from '$lib/server/lib/projects';
import { validateProjectForm, type ProjectFormData, type ProjectFormErrors } from '$lib/server/validation/project';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, { error: 'You must be logged in to create a project' });
		}

		const formData = await request.formData();
		const { data, errors } = validateProjectForm(formData);
		
		// Add ownerId from session
		data.ownerId = user.id;
		
		// Check for validation errors
		const allErrors: ProjectFormErrors = { ...errors };
		if (!data.name) allErrors.name = 'Project name is required';
		
		if (Object.keys(allErrors).length > 0) {
			return fail(400, { errors: allErrors });
		}

		try {
			const projectId = await createProject(data as ProjectFormData);
			return { projectId };
		} catch (error) {
			console.error('Error creating project:', error);
			return fail(500, { error: 'Failed to create project' });
		}
	}
};
