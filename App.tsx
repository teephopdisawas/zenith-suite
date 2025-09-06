import React, { useState, useEffect } from 'react';
import { View, ThemeName } from './types';
import Sidebar from './components/Sidebar';
import JiraBoard from './components/JiraBoard';
import TodoList from './components/TodoList';
import Notes from './components/Notes';
import ExpensesTracker from './components/ExpensesTracker';
import WordProcessor from './components/WordProcessor';
import Spreadsheet from './components/Spreadsheet';
import Presentation from './components/Presentation';

const themes: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-tertiary': '#334155',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#94a3b8',
    '--border-color': '#334155',
    '--accent': '#0ea5e9',
    '--accent-hover': '#0284c7',
    '--accent-text': '#ffffff',
    '--danger': '#f43f5e',
    '--status-todo': '#f43f5e',
    '--status-inprogress': '#f59e0b',
    '--status-done': '#10b981',
  },
  light: {
    '--bg-primary': '#f1f5f9',
    '--bg-secondary': '#ffffff',
    '--bg-tertiary': '#e2e8f0',
    '--text-primary': '#0f172a',
    '--text-secondary': '#64748b',
    '--border-color': '#e2e8f0',
    '--accent': '#0ea5e9',
    '--accent-hover': '#0284c7',
    '--accent-text': '#ffffff',
    '--danger': '#e11d48',
    '--status-todo': '#e11d48',
    '--status-inprogress': '#d97706',
    '--status-done': '#059669',
  },
  midnight: {
    '--bg-primary': '#191324',
    '--bg-secondary': '#231a33',
    '--bg-tertiary': '#3e2d5a',
    '--text-primary': '#e9e6f2',
    '--text-secondary': '#a89cc1',
    '--border-color': '#3e2d5a',
    '--accent': '#ff79c6',
    '--accent-hover': '#ff92d3',
    '--accent-text': '#191324',
    '--danger': '#ff5555',
    '--status-todo': '#ff5555',
    '--status-inprogress': '#f1fa8c',
    '--status-done': '#50fa7b',
  }
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Jira);
  const [theme, setTheme] = useState<ThemeName>('dark');

  useEffect(() => {
    const currentTheme = themes[theme];
    const root = document.documentElement;
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  const renderActiveView = () => {
    switch (activeView) {
      case View.Jira:
        return <JiraBoard />;
      case View.TodoList:
        return <TodoList />;
      case View.Notes:
        return <Notes />;
      case View.Expenses:
        return <ExpensesTracker theme={theme} />;
      case View.Word:
        return <WordProcessor />;
      case View.Excel:
        return <Spreadsheet />;
      case View.PowerPoint:
        return <Presentation />;
      default:
        return <JiraBoard />;
    }
  };

  return (
    <div className="flex h-screen bg-primary text-text-primary font-sans transition-colors duration-300">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        activeTheme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;