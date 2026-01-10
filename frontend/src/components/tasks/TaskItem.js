// frontend/src/components/tasks/TaskItem.js
import { useState } from 'react';

const TaskItem = ({ task, userId, authToken, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || ''
  });
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${task.id}/complete`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed: !task.completed })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`);
      }

      // Refresh the task list
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description || ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${task.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`);
      }

      setIsEditing(false);
      // Refresh the task list
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || ''
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${task.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete task: ${response.status}`);
        }

        // Refresh the task list
        onUpdate();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`task-item ${task.completed ? 'completed bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-white to-blue-50'} p-5 mb-4 rounded-xl border-l-4 ${task.completed ? 'border-green-500' : 'border-indigo-500'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      {error && <div className="error-message mb-3 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium mb-3"
            required
            placeholder="Task title..."
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
            rows="3"
            placeholder="Task description..."
          />
          <div className="task-actions flex space-x-3">
            <button onClick={handleSave} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save
            </button>
            <button onClick={handleCancel} className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-content">
          <div className="task-header flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center h-7 w-7 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={handleToggleComplete}
                  className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                />
              </div>
              <span className={`task-title ml-3 ${task.completed ? 'completed text-gray-600 line-through decoration-gray-400' : 'text-gray-800 font-medium'}`}>
                {task.title}
              </span>
            </div>
            <span className={`task-status px-3 py-1 text-sm font-bold rounded-full ${task.completed ? 'status-completed bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' : 'status-pending bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800'} shadow-inner`}>
              {task.completed ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending
                </>
              )}
            </span>
          </div>

          {task.description && (
            <div className="task-description mt-3 p-3 bg-white bg-opacity-50 rounded-lg text-gray-700 border border-gray-200">
              {task.description}
            </div>
          )}

          <div className="task-meta mt-3 flex justify-between items-center">
            <span className="task-date text-sm text-gray-500 italic">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {new Date(task.created_at).toLocaleDateString()}
            </span>
            <div className="task-actions flex space-x-2">
              <button onClick={handleEdit} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button onClick={handleDelete} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;