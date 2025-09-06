import React, { useState } from 'react';
import { JiraStatus, JiraTask } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon } from './icons';

const initialTasks: JiraTask[] = [
  { id: 'ZEN-1', title: 'Design Landing Page', description: 'Create mockups in Figma', status: JiraStatus.ToDo },
  { id: 'ZEN-2', title: 'Develop API Endpoints', description: 'User authentication and data fetching', status: JiraStatus.InProgress },
  { id: 'ZEN-3', title: 'Setup CI/CD Pipeline', description: 'Integrate with GitHub Actions', status: JiraStatus.Done },
  { id: 'ZEN-4', title: 'Write User Documentation', description: 'Cover all features and use cases', status: JiraStatus.ToDo },
];

const JiraColumn: React.FC<{
  status: JiraStatus;
  tasks: JiraTask[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: JiraStatus) => void;
  onDelete: (taskId: string) => void;
}> = ({ status, tasks, onDragStart, onDragOver, onDrop, onDelete }) => {
  const statusColors: Record<JiraStatus, string> = {
    [JiraStatus.ToDo]: 'bg-status-todo',
    [JiraStatus.InProgress]: 'bg-status-inprogress',
    [JiraStatus.Done]: 'bg-status-done',
  };

  return (
    <div
      className="bg-secondary rounded-lg p-4 flex-1"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center mb-4">
        <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status]}`}></span>
        <h3 className="font-bold text-lg text-text-primary">{status}</h3>
        <span className="ml-2 text-sm bg-tertiary text-text-secondary rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="bg-tertiary p-4 rounded-md shadow-md cursor-grab active:cursor-grabbing group"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-text-primary">{task.title}</h4>
              <button onClick={() => onDelete(task.id)} className="text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-text-secondary mt-1">{task.description}</p>
            <div className="mt-3 text-right">
              <span className="text-xs text-text-secondary font-mono bg-primary px-1.5 py-0.5 rounded">{task.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JiraBoard: React.FC = () => {
  const [tasks, setTasks] = useState<JiraTask[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: JiraStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;

    const taskNumbers = tasks.map(t => parseInt(t.id.split('-')[1] || '0', 10)).filter(n => !isNaN(n));
    const newIdNumber = (taskNumbers.length > 0 ? Math.max(...taskNumbers) : 0) + 1;
    const newId = `ZEN-${newIdNumber}`;

    const newTask: JiraTask = {
      id: newId,
      title: newTaskTitle,
      description: newTaskDesc,
      status: JiraStatus.ToDo,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsModalOpen(false);
  };

  const columns = Object.values(JiraStatus);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Jira Board</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-accent hover:bg-accent-hover text-accent-text font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>
      <div className="flex gap-6">
        {columns.map((status) => (
          <JiraColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <div className="space-y-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder="Task Description"
            rows={3}
            className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleAddTask}
            className="w-full bg-accent hover:bg-accent-hover text-accent-text font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Add Task
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JiraBoard;