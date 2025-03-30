import { createContext, useReducer, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import PropTypes from 'prop-types';

// Add this at the bottom before exporting TaskProvider
TaskProvider.propTypes = {
  children: PropTypes.node.isRequired
};


const TaskContext = createContext();

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null
};

// Reducer function
function taskReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload], loading: false };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false
      };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks on component mount
  useEffect(() => {
    async function fetchTasks() {
      dispatch({ type: 'LOADING' });
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const taskList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({ type: 'LOAD_TASKS', payload: taskList });
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
      }
    }

    fetchTasks();
  }, []);

  // Add a new task
  async function addTask(task) {
    dispatch({ type: 'LOADING' });
    try {
      const newTask = {
        ...task,
        createdAt: new Date(),
        completed: false
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      dispatch({ 
        type: 'ADD_TASK', 
        payload: { id: docRef.id, ...newTask } 
      });
      return docRef.id;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  }

  // Update an existing task
  async function updateTask(id, updatedTask) {
    dispatch({ type: 'LOADING' });
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updatedTask);
      dispatch({ 
        type: 'UPDATE_TASK', 
        payload: { id, ...updatedTask } 
      });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  }

  // Delete a task
  async function deleteTask(id) {
    dispatch({ type: 'LOADING' });
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  }

  return (
    <TaskContext.Provider value={{ 
      tasks: state.tasks, 
      loading: state.loading, 
      error: state.error, 
      addTask, 
      updateTask, 
      deleteTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
}