import React from 'react';
import { View, ThemeName } from '../types';
import { JiraIcon, TodoListIcon, NotesIcon, ExpensesIcon, WordIcon, ExcelIcon, PowerPointIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  activeTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-accent text-accent-text'
        : 'text-text-secondary hover:bg-tertiary hover:text-text-primary'
    }`}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </button>
);

const ThemeSwitcher: React.FC<{
  activeTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}> = ({ activeTheme, setTheme }) => {
  const themeOptions: { name: ThemeName; colors: string[] }[] = [
    { name: 'dark', colors: ['#0f172a', '#0ea5e9'] },
    { name: 'light', colors: ['#f1f5f9', '#0ea5e9'] },
    { name: 'midnight', colors: ['#191324', '#ff79c6'] },
  ];

  return (
    <div className="mt-auto">
       <p className="text-xs text-text-secondary mb-2 px-2">Theme</p>
       <div className="flex justify-around bg-primary rounded-lg p-1">
        {themeOptions.map(option => (
          <button
            key={option.name}
            onClick={() => setTheme(option.name)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${activeTheme === option.name ? 'ring-2 ring-offset-2 ring-offset-primary ring-accent' : 'ring-2 ring-transparent hover:ring-2 hover:ring-border-color'}`}
            aria-label={`Switch to ${option.name} theme`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex -space-x-4 border border-border-color">
              <div className="w-8 h-8" style={{ backgroundColor: option.colors[0] }}></div>
              <div className="w-8 h-8" style={{ backgroundColor: option.colors[1] }}></div>
            </div>
          </button>
        ))}
       </div>
    </div>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, activeTheme, setTheme }) => {
  const mainNavItems = [
    { view: View.Jira, label: 'Jira Board', icon: <JiraIcon className="w-6 h-6" /> },
    { view: View.TodoList, label: 'To-Do List', icon: <TodoListIcon className="w-6 h-6" /> },
    { view: View.Notes, label: 'Notes', icon: <NotesIcon className="w-6 h-6" /> },
    { view: View.Expenses, label: 'Expenses', icon: <ExpensesIcon className="w-6 h-6" /> },
  ];

  const officeNavItems = [
    { view: View.Word, label: 'Word Processor', icon: <WordIcon className="w-6 h-6" /> },
    { view: View.Excel, label: 'Spreadsheet', icon: <ExcelIcon className="w-6 h-6" /> },
    { view: View.PowerPoint, label: 'Presentation', icon: <PowerPointIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 bg-secondary p-4 flex flex-col transition-colors duration-300">
      <div className="flex items-center mb-10 px-2">
        <div className="w-8 h-8 bg-accent rounded-full mr-3"></div>
        <h1 className="text-xl font-bold text-text-primary">Zenith Suite</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
        <div className="px-4 py-2">
          <div className="border-t border-border-color"></div>
        </div>
        {officeNavItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </nav>
      <ThemeSwitcher activeTheme={activeTheme} setTheme={setTheme} />
      <div className="text-center text-text-secondary text-xs mt-4">
          <p>&copy; 2024 Zenith Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;