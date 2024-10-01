import { useState } from 'react';

export default function AddScheduleButton() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const addSchedule = async () => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		const scheduleData = {
			scheduleName: 'Test Schedule',
			apiEndpoint: '/api/test-endpoint',
			frequency: 'daily',
			nextExecution: '2024-10-01T12:00:00Z',
			lastExecution: null,
			responseTime: null,
			status: 'pending',
			errorLog: null,
		};

		try {
			const response = await fetch('/api/schedule', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(scheduleData),
			});

			const result = await response.json();
			if (response.ok) {
				setSuccess('Schedule added successfully!');
			} else {
				setError('Failed to add schedule.');
			}
		} catch (err) {
			console.error('Error:', err);
			setError('An error occurred while adding the schedule.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button onClick={addSchedule} disabled={loading}>
				{loading ? 'Adding...' : 'Add Schedule'}
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{success && <p style={{ color: 'green' }}>{success}</p>}
		</div>
	);
}
