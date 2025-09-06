export enum View {
  Jira = 'Jira',
  TodoList = 'TodoList',
  Notes = 'Notes',
  Expenses = 'Expenses',
  Word = 'Word',
  Excel = 'Excel',
  PowerPoint = 'PowerPoint',
}

export enum JiraStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface JiraTask {
  id: string;
  title: string;
  description: string;
  status: JiraStatus;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export type ThemeName = 'dark' | 'light' | 'midnight';