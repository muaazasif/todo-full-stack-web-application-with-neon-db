// frontend/src/app/tasks/page.js
'use client'; // This is a client-side component

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import TaskList from '../../components/tasks/TaskList';
import TaskForm from '../../components/tasks/TaskForm';
import Link from 'next/link';

export default function TasksPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Authentication Required
          </h2>
          <p className="mt-2 text-gray-600">
            You need to be signed in to access your tasks.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the token directly when needed
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || '';
    }
    return '';
  };

  const authToken = getToken();

  const refreshTasks = () => {
    // This function would trigger a re-fetch of tasks
    // In a real implementation, this might use a state management solution
    // or a more sophisticated data fetching mechanism
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden md:block">
                Welcome, {user?.email?.split('@')[0]}
              </span>
              <Link
                href="/auth/logout"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </Link>
            </div>
          </div>

          {user && authToken ? (
            <div className="space-y-8">
              <TaskForm
                userId={user.id}
                authToken={authToken}
                onCreate={refreshTasks}
              />
              <TaskList
                userId={user.id}
                authToken={authToken}
              />
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading user information...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}