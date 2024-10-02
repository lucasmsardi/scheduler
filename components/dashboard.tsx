'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	PlusIcon,
	RefreshCwIcon,
	Edit2Icon,
	Trash2Icon,
	PlayIcon,
} from 'lucide-react';
import { Task } from '@/types/types';

const formatDateForDisplay = (dateString: string | null) => {
	if (!dateString || dateString === 'N/A') return 'N/A';

	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export function DashboardComponent() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [nextExecutionDate, setNextExecutionDate] = useState(
		new Date().toISOString().split('T')[0]
	);
	const [nextExecutionTime, setNextExecutionTime] = useState('12:00');
	const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
		name: '',
		apiEndpoint: '',
		frequency: 'Daily',
		nextExecution: new Date().toISOString(),
		lastExecution: 'N/A',
		responseTime: null,
		status: 'Active',
		errorLog: '',
	});
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch('/api/schedules');
				const data = await response.json();

				if (Array.isArray(data)) {
					const validTasks = data.map((task: Partial<Task>) => ({
						id: task.id || '',
						name: task.name || 'Unnamed Task',
						apiEndpoint: task.apiEndpoint || 'No API Endpoint',
						frequency: task.frequency || 'Daily',
						nextExecution: task.nextExecution || 'N/A',
						lastExecution: task.lastExecution || 'N/A',
						responseTime: task.responseTime ?? 'N/A',
						status: task.status || 'Inactive',
						errorLog: task.errorLog || '',
					})) as Task[];

					setTasks(validTasks);
				} else {
					console.error('Unexpected data format:', data);
					setTasks([]);
				}
			} catch (error) {
				console.error('Failed to fetch tasks:', error);
				setTasks([]);
			}
		};

		fetchTasks();
	}, []);

	const filteredTasks = tasks.filter(
		(task) =>
			(task.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(task.apiEndpoint?.toLowerCase() || '').includes(searchTerm.toLowerCase())
	);

	const handleAddNewTask = async () => {
		const combinedDateTime = new Date(
			`${nextExecutionDate}T${nextExecutionTime}:00Z`
		).toISOString();

		const newTaskWithDefaults: Omit<Task, 'id'> = {
			...newTask,
			nextExecution: combinedDateTime,
			lastExecution: 'N/A',
			responseTime: null,
		};

		const response = await fetch('/api/schedules', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newTaskWithDefaults),
		});

		if (response.ok) {
			const createdTask = await response.json();
			setTasks((prevTasks) => [...prevTasks, createdTask]);
		}

		resetTaskForm();
		setIsDialogOpen(false);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);

		const nextExecutionISO = task.nextExecution?.replace(' ', 'T');

		const date = nextExecutionISO ? new Date(nextExecutionISO) : null;

		if (date && !isNaN(date.getTime())) {
			setNextExecutionDate(date.toISOString().split('T')[0]);
			setNextExecutionTime(date.toISOString().split('T')[1].substring(0, 5));
		} else {
			setNextExecutionDate('');
			setNextExecutionTime('12:00');
		}

		setNewTask({
			name: task.name,
			apiEndpoint: task.apiEndpoint,
			frequency: task.frequency,
			nextExecution: task.nextExecution,
			lastExecution: task.lastExecution,
			responseTime: task.responseTime,
			status: task.status,
			errorLog: task.errorLog,
		});

		setIsDialogOpen(true);
	};

	const handleSaveTask = () => {
		const combinedDateTime = new Date(
			`${nextExecutionDate}T${nextExecutionTime}:00Z`
		).toISOString();

		if (editingTask) {
			const updatedTask = {
				...newTask,
				nextExecution: combinedDateTime,
			};
			setTasks(
				tasks.map((task) =>
					task.id === editingTask.id ? { ...editingTask, ...updatedTask } : task
				)
			);
			setEditingTask(null);
		} else {
			handleAddNewTask();
		}
		setIsDialogOpen(false);
	};

	const resetTaskForm = () => {
		setNewTask({
			name: '',
			apiEndpoint: '',
			frequency: 'Daily',
			nextExecution: new Date().toISOString(),
			lastExecution: 'N/A',
			responseTime: null,
			status: 'Active',
			errorLog: '',
		});
		setNextExecutionDate(new Date().toISOString().split('T')[0]);
		setNextExecutionTime('12:00');
	};

	const handleDelete = async (taskId: string) => {
		const response = await fetch(`/api/schedules/${taskId}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			setTasks(tasks.filter((task) => task.id !== taskId));
		}
	};

	const handleRun = async (taskId: string) => {
		const response = await fetch(`/api/schedules/${taskId}/run`, {
			method: 'POST',
		});

		if (response.ok) {
			const updatedTask = await response.json();
			setTasks(
				tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
			);
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Morpheus Dashboard</h1>
			<div className='flex justify-between mb-4'>
				<div className='flex gap-2'>
					<Input
						placeholder='Search tasks...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-64'
					/>
					<Button variant='outline' size='icon'>
						<RefreshCwIcon className='h-4 w-4' />
					</Button>
				</div>

				<Dialog
					open={isDialogOpen}
					onOpenChange={(open) => {
						if (!editingTask && open) resetTaskForm();
						setIsDialogOpen(open);
					}}
				>
					<DialogTrigger asChild>
						<Button onClick={() => setEditingTask(null)}>
							<PlusIcon className='mr-2 h-4 w-4' /> Add New Task
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editingTask ? 'Edit Task' : 'Add New Task'}
							</DialogTitle>
							<DialogDescription>
								Please enter the details of the task.
							</DialogDescription>
						</DialogHeader>
						<div className='flex flex-col gap-4'>
							<Input
								placeholder='Task Name'
								value={newTask.name}
								onChange={(e) =>
									setNewTask({ ...newTask, name: e.target.value })
								}
							/>
							<Input
								placeholder='API Endpoint'
								value={newTask.apiEndpoint}
								onChange={(e) =>
									setNewTask({ ...newTask, apiEndpoint: e.target.value })
								}
							/>
							<input
								type='date'
								value={nextExecutionDate}
								onChange={(e) => setNextExecutionDate(e.target.value)}
								className='p-2 border rounded'
							/>
							<input
								type='time'
								value={nextExecutionTime}
								onChange={(e) => setNextExecutionTime(e.target.value)}
								className='p-2 border rounded'
							/>
							<select
								value={newTask.frequency}
								onChange={(e) =>
									setNewTask({
										...newTask,
										frequency: e.target.value as 'Daily' | 'Weekly' | 'Monthly',
									})
								}
								className='p-2 border rounded'
							>
								<option value='Daily'>Daily</option>
								<option value='Weekly'>Weekly</option>
								<option value='Monthly'>Monthly</option>
							</select>
							<Button onClick={handleSaveTask}>
								{editingTask ? 'Save Changes' : 'Add Task'}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Schedule Name</TableHead>
							<TableHead>API Endpoint</TableHead>
							<TableHead>Frequency</TableHead>
							<TableHead>Next Execution</TableHead>
							<TableHead>Last Execution</TableHead>
							<TableHead>Response Time</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Error Log</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTasks.map((task) => (
							<TableRow key={task.id}>
								<TableCell className='font-medium'>{task.name}</TableCell>
								<TableCell>{task.apiEndpoint}</TableCell>
								<TableCell>{task.frequency}</TableCell>
								<TableCell>
									{formatDateForDisplay(task.nextExecution)}
								</TableCell>
								<TableCell>
									{formatDateForDisplay(task.lastExecution)}
								</TableCell>
								<TableCell>{task.responseTime}</TableCell>
								<TableCell>
									<Badge
										variant={
											task.status === 'Active'
												? 'default'
												: task.status === 'Inactive'
												? 'secondary'
												: 'destructive'
										}
									>
										{task.status}
									</Badge>
								</TableCell>
								<TableCell>
									{task.errorLog ? (
										<Dialog>
											<DialogTrigger asChild>
												<Button variant='link' className='p-0 h-auto'>
													View Error
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Error Log</DialogTitle>
													<DialogDescription>{task.errorLog}</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									) : (
										'No errors'
									)}
								</TableCell>
								<TableCell>
									<div className='flex space-x-2'>
										<Button
											variant='ghost'
											size='icon'
											title='Edit'
											onClick={() => handleEditTask(task)}
										>
											<Edit2Icon className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											title='Delete'
											onClick={() => handleDelete(task.id)}
										>
											<Trash2Icon className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											title='Run Now'
											onClick={() => handleRun(task.id)}
										>
											<PlayIcon className='h-4 w-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
