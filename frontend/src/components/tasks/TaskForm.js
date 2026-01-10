// frontend/src/components/tasks/TaskForm.js
import { useState } from 'react';

const TaskForm = ({ userId, authToken, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status}`);
      }

      // Reset form
      setFormData({ title: '', description: '' });

      // Refresh the task list
      onCreate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="task-form-container bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-2xl shadow-xl border border-indigo-100">
      <div className="flex items-center mb-5">
        <div className="bg-indigo-500 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Create New Task</h3>
      </div>
      {error && <div className="error-message mb-4 p-3 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group mb-5">
          <label htmlFor="title" className="block text-sm font-semibold text-indigo-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength="200"
            required
            placeholder="Enter task title..."
            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium bg-white"
          />
        </div>

        <div className="form-group mb-6">
          <label htmlFor="description" className="block text-sm font-semibold text-indigo-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength="1000"
            placeholder="Add task details (optional)..."
            rows="4"
            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>

        <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;