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

type Task = {
	id: string;
	name: string;
	apiEndpoint: string;
	frequency: 'Daily' | 'Weekly' | 'Monthly';
	nextExecution: string;
	lastExecution: string;
	responseTime: string;
	status: 'Active' | 'Inactive' | 'Error';
	errorLog: string;
};

export function DashboardComponent() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: '1',
			name: 'Daily User Sync',
			apiEndpoint: 'https://api.example.com/sync-users',
			frequency: 'Daily',
			nextExecution: '2023-09-25 00:00:00',
			lastExecution: '2023-09-24 00:00:00',
			responseTime: '1.2s',
			status: 'Active',
			errorLog: '',
		},
		{
			id: '2',
			name: 'Weekly Report Generation',
			apiEndpoint: 'https://api.example.com/generate-report',
			frequency: 'Weekly',
			nextExecution: '2023-09-25 01:00:00',
			lastExecution: '2023-09-18 01:00:00',
			responseTime: '3.5s',
			status: 'Active',
			errorLog: '',
		},
		{
			id: '3',
			name: 'Monthly Data Backup',
			apiEndpoint: 'https://api.example.com/backup',
			frequency: 'Monthly',
			nextExecution: '2023-10-01 02:00:00',
			lastExecution: '2023-09-01 02:00:00',
			responseTime: '10.7s',
			status: 'Error',
			errorLog: 'Connection timeout',
		},
	]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await fetch('/api/users');
			const data = await response.json();
			console.log(data);
		};

		fetchUsers();
	}, []);

	const [searchTerm, setSearchTerm] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newTask, setNewTask] = useState<
		Omit<
			Task,
			'id' | 'nextExecution' | 'lastExecution' | 'responseTime' | 'errorLog'
		>
	>({
		name: '',
		apiEndpoint: '',
		frequency: 'Daily',
		status: 'Active',
	});
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	const filteredTasks = tasks.filter(
		(task) =>
			task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.apiEndpoint.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = (id: string) => {
		setTasks(tasks.filter((task) => task.id !== id));
	};

	const handleRun = (id: string) => {
		console.log(`Running task ${id}`);
	};

	const handleAddNewTask = () => {
		const newTaskWithDefaults: Task = {
			...newTask,
			id: (tasks.length + 1).toString(),
			nextExecution: 'N/A',
			lastExecution: 'N/A',
			responseTime: 'N/A',
			errorLog: '',
		};

		setTasks([...tasks, newTaskWithDefaults]);
		resetTaskForm();
		setIsDialogOpen(false);
	};

	const handleEditTask = (task: Task) => {
		setEditingTask(task);
		setNewTask({
			name: task.name,
			apiEndpoint: task.apiEndpoint,
			frequency: task.frequency,
			status: task.status,
		});
		setIsDialogOpen(true);
	};

	const handleSaveTask = () => {
		if (editingTask) {
			setTasks(
				tasks.map((task) =>
					task.id === editingTask.id ? { ...editingTask, ...newTask } : task
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
			status: 'Active',
		});
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
								<TableCell>{task.nextExecution}</TableCell>
								<TableCell>{task.lastExecution}</TableCell>
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
