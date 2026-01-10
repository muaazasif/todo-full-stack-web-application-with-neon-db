// frontend/src/components/tasks/TaskList.js
import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';

const TaskList = ({ userId, authToken }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [sort, setSort] = useState('created'); // 'created', 'title'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/?status_filter=${filter}&sort_by=${sort}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on initial load and when filter/sort changes
  useEffect(() => {
    if (authToken) {
      fetchTasks();
    }
  }, [authToken, filter, sort]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply status filter
    if (filter === 'pending') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply sorting
    if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Sort by creation date (newest first)
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredTasks(result);
  }, [tasks, filter, sort]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="task-list-container bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          My Tasks
        </h2>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      <div className="task-list mt-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
            <p className="text-gray-500 text-lg">No tasks found. Create your first task!</p>
            <p className="text-gray-400 mt-2">Add a new task using the form above</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              userId={userId}
              authToken={authToken}
              onUpdate={fetchTasks} // Refresh tasks after update
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;