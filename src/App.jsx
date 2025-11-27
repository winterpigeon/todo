import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Palette } from 'lucide-react';

const themes = {
  blue: {
    name: 'Ocean Blue',
    bg: 'from-blue-400 via-cyan-400 to-blue-500',
    glass: 'bg-white/20 backdrop-blur-xl border-white/30',
    text: 'text-white',
    button: 'bg-white/30 hover:bg-white/40 text-white',
    accent: 'bg-blue-500'
  },
  black: {
    name: 'Midnight',
    bg: 'from-gray-900 via-gray-800 to-black',
    glass: 'bg-white/10 backdrop-blur-xl border-white/20',
    text: 'text-white',
    button: 'bg-white/20 hover:bg-white/30 text-white',
    accent: 'bg-gray-700'
  },
  red: {
    name: 'Sunset Red',
    bg: 'from-red-400 via-pink-400 to-red-500',
    glass: 'bg-white/20 backdrop-blur-xl border-white/30',
    text: 'text-white',
    button: 'bg-white/30 hover:bg-white/40 text-white',
    accent: 'bg-red-500'
  },
  green: {
    name: 'Forest Green',
    bg: 'from-green-400 via-emerald-400 to-green-500',
    glass: 'bg-white/20 backdrop-blur-xl border-white/30',
    text: 'text-white',
    button: 'bg-white/30 hover:bg-white/40 text-white',
    accent: 'bg-green-600'
  },
  dark: {
    name: 'Dark Mode',
    bg: 'from-slate-900 via-purple-900 to-slate-900',
    glass: 'bg-white/10 backdrop-blur-xl border-white/20',
    text: 'text-white',
    button: 'bg-white/20 hover:bg-white/30 text-white',
    accent: 'bg-purple-600'
  },
  light: {
    name: 'Light Mode',
    bg: 'from-orange-200 via-pink-200 to-purple-200',
    glass: 'bg-white/40 backdrop-blur-xl border-white/50',
    text: 'text-gray-800',
    button: 'bg-white/50 hover:bg-white/60 text-gray-800',
    accent: 'bg-purple-400'
  }
};

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('blue');
  const [showThemes, setShowThemes] = useState(false);

  // Load tasks and theme from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    const savedTheme = localStorage.getItem('todoTheme');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('todoTheme', theme);
  }, [theme]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 md:p-8 transition-all duration-500`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl border p-6 md:p-8 mb-6 shadow-2xl`}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">My Tasks</h1>
            <button
              onClick={() => setShowThemes(!showThemes)}
              className={`${currentTheme.button} p-3 rounded-xl transition-all duration-200 shadow-lg`}
            >
              <Palette size={24} />
            </button>
          </div>
          <p className="opacity-80 text-sm md:text-base">
            {tasks.filter(t => !t.completed).length} tasks remaining
          </p>
        </div>

        {/* Theme Selector */}
        {showThemes && (
          <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl border p-4 md:p-6 mb-6 shadow-2xl`}>
            <h3 className="font-semibold mb-4 text-lg">Choose Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(themes).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setShowThemes(false);
                  }}
                  className={`${currentTheme.button} p-4 rounded-2xl transition-all duration-200 shadow-lg text-left ${
                    theme === key ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.bg} mb-2`}></div>
                  <span className="font-medium text-sm">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Task Input */}
        <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl border p-4 md:p-6 mb-6 shadow-2xl`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className={`flex-1 ${currentTheme.glass} ${currentTheme.text} placeholder-current placeholder-opacity-50 rounded-2xl px-4 md:px-6 py-3 md:py-4 border focus:outline-none focus:ring-2 focus:ring-white/50 text-base md:text-lg`}
            />
            <button
              onClick={addTask}
              className={`${currentTheme.button} p-3 md:p-4 rounded-2xl transition-all duration-200 shadow-lg hover:scale-105`}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl border p-8 md:p-12 text-center shadow-2xl`}>
              <p className="opacity-60 text-base md:text-lg">No tasks yet. Add one above! ✨</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`${currentTheme.glass} ${currentTheme.text} rounded-2xl md:rounded-3xl border p-4 md:p-6 shadow-xl transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 ${
                      task.completed ? currentTheme.accent : 'border-current'
                    } flex items-center justify-center transition-all duration-200 hover:scale-110`}
                  >
                    {task.completed && <Check size={16} className="text-white" />}
                  </button>
                  <span className={`flex-1 text-base md:text-lg ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={`flex-shrink-0 ${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}