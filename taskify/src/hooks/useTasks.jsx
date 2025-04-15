import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as taskService from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchTasks() {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userTasks = await taskService.getUserTasks(currentUser.uid);
        setTasks(userTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [currentUser]);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData, currentUser.uid);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      await taskService.updateTask(taskId, taskData);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...taskData } : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  };

  const toggleCompletion = async (taskId, currentStatus) => {
    try {
      const newStatus = await taskService.toggleTaskCompletion(taskId, currentStatus);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: newStatus } : task
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
  };
}