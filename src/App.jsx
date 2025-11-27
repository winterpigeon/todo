import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Palette, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

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

const compliments = [
  "Amazing! 🎉", "You're crushing it! 💪", "Fantastic work! ⭐", 
  "Keep going! 🚀", "You're on fire! 🔥", "Incredible! 🌟",
  "Awesome job! 🎊", "You're unstoppable! 💫", "Great work! 👏",
  "Brilliant! ✨", "You rock! 🎸", "Superb! 🏆"
];

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [theme, setTheme] = useState('blue');
  const [showThemes, setShowThemes] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [addingSubtaskTo, setAddingSubtaskTo] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    const savedTheme = localStorage.getItem('todoTheme');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('todoTheme', theme);
  }, [theme]);

  const showCelebration = () => {
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    setCelebration(randomCompliment);
    setTimeout(() => setCelebration(null), 2000);
  };

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { 
        id: Date.now(), 
        text: input, 
        completed: false,
        subtasks: []
      }]);
      setInput('');
    }
  };

  const addSubtask = (taskId) => {
    if (subtaskInput.trim()) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: [...task.subtasks, { 
                id: Date.now(), 
                text: subtaskInput, 
                completed: false 
              }]
            }
          : task
      ));
      setSubtaskInput('');
      setAddingSubtaskTo(null);
    }
  };

  const toggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task.completed) showCelebration();
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    showCelebration();
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(sub =>
              sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            )
          }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(sub => sub.id !== subtaskId) }
        : task
    ));
  };

  const toggleExpanded = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleDragStart = (e, index, isSubtask = false, parentId = null) => {
    setDraggedItem({ index, isSubtask, parentId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex, isSubtask = false, parentId = null) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (!isSubtask && !draggedItem.isSubtask) {
      // Reordering main tasks
      const newTasks = [...tasks];
      const [removed] = newTasks.splice(draggedItem.index, 1);
      newTasks.splice(dropIndex, 0, removed);
      setTasks(newTasks);
    } else if (isSubtask && draggedItem.isSubtask && draggedItem.parentId === parentId) {
      // Reordering subtasks within same parent
      const newTasks = tasks.map(task => {
        if (task.id === parentId) {
          const newSubtasks = [...task.subtasks];
          const [removed] = newSubtasks.splice(draggedItem.index, 1);
          newSubtasks.splice(dropIndex, 0, removed);
          return { ...task, subtasks: newSubtasks };
        }
        return task;
      });
      setTasks(newTasks);
    }

    setDraggedItem(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') action();
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} p-4 md:p-8 transition-all duration-500 relative overflow-hidden`}>
      {/* Celebration Animation */}
      {celebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-ping absolute">
            <div className="text-8xl md:text-9xl">🔥</div>
          </div>
          <div className={`${currentTheme.glass} ${currentTheme.text} px-8 py-4 rounded-3xl border text-2xl md:text-4xl font-bold shadow-2xl animate-bounce`}>
            {celebration}
          </div>
        </div>
      )}

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
              onKeyPress={(e) => handleKeyPress(e, addTask)}
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
            tasks.map((task, taskIndex) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, taskIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, taskIndex)}
                className={`${currentTheme.glass} ${currentTheme.text} rounded-2xl md:rounded-3xl border shadow-xl transition-all duration-200`}
              >
                {/* Main Task */}
                <div className="p-4 md:p-6 hover:bg-white/5">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripVertical size={20} className="opacity-50" />
                    </div>
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
                    {task.subtasks.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(task.id)}
                        className={`${currentTheme.button} p-2 rounded-xl transition-all duration-200`}
                      >
                        {expandedTasks[task.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    )}
                    <button
                      onClick={() => setAddingSubtaskTo(addingSubtaskTo === task.id ? null : task.id)}
                      className={`${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
                      title="Add subtask"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`flex-shrink-0 ${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Add Subtask Input */}
                {addingSubtaskTo === task.id && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <div className="flex gap-2 ml-8">
                      <input
                        type="text"
                        value={subtaskInput}
                        onChange={(e) => setSubtaskInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, () => addSubtask(task.id))}
                        placeholder="Add subtask..."
                        className={`flex-1 ${currentTheme.glass} ${currentTheme.text} placeholder-current placeholder-opacity-50 rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-white/50 text-sm md:text-base`}
                        autoFocus
                      />
                      <button
                        onClick={() => addSubtask(task.id)}
                        className={`${currentTheme.button} px-4 py-2 rounded-xl transition-all duration-200`}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtasks */}
                {expandedTasks[task.id] && task.subtasks.length > 0 && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                    {task.subtasks.map((subtask, subIndex) => (
                      <div
                        key={subtask.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, subIndex, true, task.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, subIndex, true, task.id)}
                        className={`ml-8 flex items-center gap-2 md:gap-3 p-3 rounded-xl ${currentTheme.glass} border hover:bg-white/5`}
                      >
                        <div className="cursor-grab active:cursor-grabbing">
                          <GripVertical size={16} className="opacity-50" />
                        </div>
                        <button
                          onClick={() => toggleSubtask(task.id, subtask.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                            subtask.completed ? currentTheme.accent : 'border-current'
                          } flex items-center justify-center transition-all duration-200 hover:scale-110`}
                        >
                          {subtask.completed && <Check size={12} className="text-white" />}
                        </button>
                        <span className={`flex-1 text-sm md:text-base ${subtask.completed ? 'line-through opacity-60' : ''}`}>
                          {subtask.text}
                        </span>
                        <button
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                          className={`flex-shrink-0 ${currentTheme.button} p-1.5 rounded-lg transition-all duration-200 hover:scale-110`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}