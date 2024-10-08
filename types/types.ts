export type Task = {
	id: string;
	name: string;
	apiEndpoint: string;
	frequency: 'Daily' | 'Weekly' | 'Monthly';
	nextExecution: string; 
	lastExecution: string; 
	responseTime: number | null;
	status: 'Active' | 'Inactive' | 'Error';
	errorLog: string;
};
