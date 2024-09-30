import { Task } from "@/types/types"; 

export const fetchTasks = async (): Promise<Task[]> => {
	const response = await fetch('/api/schedules');
	return response.json();
};

export const addNewTask = async (newTask: Partial<Task>): Promise<Task> => {
	const response = await fetch('/api/schedules', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newTask),
	});
	return response.json();
};

export const updateTask = async (taskId: string, updatedTask: Partial<Task>): Promise<Task> => {
	const response = await fetch(`/api/schedules/${taskId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedTask),
	});
	return response.json();
};

export const deleteTask = async (taskId: string): Promise<void> => {
	await fetch(`/api/schedules/${taskId}`, {
		method: 'DELETE',
	});
};

export const runTask = async (taskId: string): Promise<Task> => {
	const response = await fetch(`/api/schedules/${taskId}/run`, {
		method: 'POST',
	});
	return response.json();
};
