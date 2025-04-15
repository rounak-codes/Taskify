import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs, 
    getDoc, 
    serverTimestamp, 
    orderBy 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Create a new task
  export const createTask = async (taskData, userId) => {
    try {
      const task = {
        ...taskData,
        userId,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'tasks'), task);
      return { id: docRef.id, ...task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };
  
  // Get all tasks for a user
  export const getUserTasks = async (userId) => {
    try {
      const q = query(
        collection(db, 'tasks'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  };
  
  // Get a specific task
  export const getTask = async (taskId) => {
    try {
      const docRef = doc(db, 'tasks', taskId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  };
  
  // Update a task
  export const updateTask = async (taskId, taskData) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp(),
      });
      
      return { id: taskId, ...taskData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  // Delete a task
  export const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };
  
  // Toggle task completion status
  export const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
        updatedAt: serverTimestamp(),
      });
      
      return !currentStatus;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  };