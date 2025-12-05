import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Palette, ChevronDown, ChevronRight, GripVertical, Edit2 } from 'lucide-react';

const themes = {
  blue: {
    name: 'Color Splash',
    bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80',
    glass: 'bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
    text: 'text-black',
    button: 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xl border-2 border-white/50',
    accent: 'bg-blue-500/80 backdrop-blur-sm'
  },
  black: {
    name: 'Midnight',
    bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    glass: 'bg-white/20 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]',
    text: 'text-white',
    button: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-3xl border-1 border-white/50',
    accent: 'bg-gray-600/80 backdrop-blur-sm'
  },
  red: {
    name: 'Beach Vibes',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    glass: 'bg-white/40 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
    text: 'text-black',
    button: 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xl border-1 border-white/50',
    accent: 'bg-red-600/80 backdrop-blur-sm'
  },
  green: {
    name: 'Forest Green',
    bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    glass: 'bg-white/10 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
    text: 'text-white',
    button: 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xl border border-white/20',
    accent: 'bg-green-600/80 backdrop-blur-sm'
  },
  dark: {
    name: 'Galaxy Dark',
    bgImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=80',
    glass: 'bg-white/25 backdrop-blur-2xl border-1 border-white/80  shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]',
    text: 'text-white',
    button: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border-1 border-white/80 ',
    accent: 'bg-purple-600/80 backdrop-blur-sm'
  },
  light: {
    name: 'Calm Blue',
    bgImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
    glass: 'bg-white/60 backdrop-blur-2xl border-1 border-white/80 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]',
    text: 'text-black',
    button: 'bg-white/40 hover:bg-white/50 text-gray-800 backdrop-blur-xl border-1 border-white/80',
    accent: 'bg-purple-400/80 backdrop-blur-sm'
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
  const [editingTask, setEditingTask] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [editText, setEditText] = useState('');

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

  const calculateProductivityScore = () => {
    if (tasks.length === 0) return 0;
    
    let totalScore = 0;
    
    tasks.forEach(task => {
      const subtaskCount = task.subtasks?.length || 0;
      
      if (subtaskCount === 0) {
        // Task with no subtasks: worth 1.0 if completed
        totalScore += task.completed ? 1.0 : 0;
      } else {
        // Task with subtasks: each subtask is a fraction
        const completedSubtasks = task.subtasks.filter(s => s.completed).length;
        totalScore += completedSubtasks / subtaskCount;
      }
    });
    
    return Math.round((totalScore / tasks.length) * 100);
  };

  const showCelebration = () => {
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    setCelebration(randomCompliment);
    setTimeout(() => setCelebration(null), 2000);
  };

  const addTask = () => {
    if (input.trim()) {
      setTasks([{ 
        id: Date.now(), 
        text: input, 
        completed: false,
        subtasks: []
      }, ...tasks]);
      setInput('');
    }
  };

  const addSubtask = (taskId) => {
    if (subtaskInput.trim()) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: [...(task.subtasks || []), { 
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

  const startEditTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const startEditSubtask = (taskId, subtask) => {
    setEditingSubtask({ taskId, subtaskId: subtask.id });
    setEditText(subtask.text);
  };

  const saveTaskEdit = () => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTask ? { ...task, text: editText } : task
      ));
    }
    setEditingTask(null);
    setEditText('');
  };

  const saveSubtaskEdit = () => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingSubtask.taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(sub =>
                sub.id === editingSubtask.subtaskId ? { ...sub, text: editText } : sub
              )
            }
          : task
      ));
    }
    setEditingSubtask(null);
    setEditText('');
  };

  const toggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newCompletedState = !task.completed;
    
    // Only celebrate when checking OFF (marking as complete)
    if (newCompletedState) {
      showCelebration();
    }
    
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        // When completing main task, complete all subtasks
        // When uncompleting main task, uncomplete all subtasks
        return {
          ...t,
          completed: newCompletedState,
          subtasks: t.subtasks?.map(sub => ({ ...sub, completed: newCompletedState })) || []
        };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    
    // Only celebrate when checking OFF (marking as complete)
    if (!subtask.completed) {
      showCelebration();
    }
    
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        
        // Auto-complete main task if all subtasks are completed
        const allSubtasksCompleted = updatedSubtasks.every(sub => sub.completed);
        
        return {
          ...t,
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted && updatedSubtasks.length > 0
        };
      }
      return t;
    }));
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
  const productivityScore = calculateProductivityScore();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: `url(${currentTheme.bgImage})`,
          filter: 'brightness(0.8)'
        }}
      />
      <div className="fixed inset-0 backdrop-blur-sm bg-black/10" />

      {/* Celebration Animation */}
      {celebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-ping absolute">
            <div className="text-8xl md:text-9xl">🔥</div>
          </div>
          <div className={`${currentTheme.glass} ${currentTheme.text} px-8 py-4 rounded-3xl text-2xl md:text-4xl font-bold animate-bounce`}>
            {celebration}
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl p-6 md:p-8 mb-6`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">My Tasks</h1>
                <p className="opacity-70 text-sm md:text-base">
                  {tasks.filter(t => !t.completed).length} tasks remaining
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`${currentTheme.glass} px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5`}>
                  <span className="font-semibold">{productivityScore}%</span>
                  <span>🔥</span>
                </div>
                <button
                  onClick={() => setShowThemes(!showThemes)}
                  className={`${currentTheme.button} p-3 rounded-2xl transition-all duration-200 hover:scale-105`}
                >
                  <Palette size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          {showThemes && (
            <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl p-4 md:p-6 mb-6`}>
              <h3 className="font-semibold mb-4 text-lg">Choose Theme</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setShowThemes(false);
                    }}
                    className={`${currentTheme.button} p-4 rounded-2xl transition-all duration-200 text-left ${
                      theme === key ? 'ring-2 ring-white/50' : ''
                    }`}
                  >
                    <div 
                      className="w-full h-12 rounded-xl mb-2 bg-cover bg-center"
                      style={{ backgroundImage: `url(${t.bgImage})` }}
                    />
                    <span className="font-medium text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Task Input */}
          <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl p-4 md:p-6 mb-6`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTask)}
                placeholder="Add a new task..."
                className={`flex-1 ${currentTheme.glass} ${currentTheme.text} placeholder-current placeholder-opacity-50 rounded-2xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-white/30 text-base md:text-lg transition-all`}
              />
              <button
                onClick={addTask}
                className={`${currentTheme.button} p-3 md:p-4 rounded-2xl transition-all duration-200 hover:scale-105`}
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className={`${currentTheme.glass} ${currentTheme.text} rounded-3xl p-8 md:p-12 text-center`}>
                <p className=" text-base md:text-lg">No tasks yet. Add one above! ✨</p>
              </div>
            ) : (
              tasks.map((task, taskIndex) => (
                <div
                  key={task.id}
                  draggable={editingTask !== task.id}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStart(e, taskIndex);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, taskIndex);
                  }}
                  className={`${currentTheme.glass} ${currentTheme.text} rounded-2xl md:rounded-3xl transition-all duration-200 overflow-hidden`}
                >
                  {/* Main Task */}
                  <div className="p-4 md:p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 md:gap-4">
                      {editingTask !== task.id && (
                        <div className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
                          <GripVertical size={20} />
                        </div>
                      )}
                      {editingTask !== task.id && (
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 ${
                            task.completed ? `${currentTheme.accent} border-transparent` : 'border-current'
                          } flex items-center justify-center transition-all duration-300 hover:scale-110`}
                        >
                          {task.completed && <Check size={16} className="text-white" />}
                        </button>
                      )}
                      
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, saveTaskEdit)}
                          onBlur={saveTaskEdit}
                          className={`flex-1 ${currentTheme.glass} ${currentTheme.text} rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 text-base md:text-lg`}
                          autoFocus
                        />
                      ) : (
                        <span className={`flex-1 text-base md:text-lg transition-all duration-300 ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.text}
                        </span>
                      )}

                      {editingTask !== task.id && (
                        <>
                          {task.subtasks && task.subtasks.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(task.id)}
                              className={`${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-105`}
                            >
                              {expandedTasks[task.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                          )}
                          <button
                            onClick={() => setAddingSubtaskTo(addingSubtaskTo === task.id ? null : task.id)}
                            className={`${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-105`}
                            title="Add subtask"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => startEditTask(task)}
                            className={`${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-105`}
                            title="Edit task"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className={`flex-shrink-0 ${currentTheme.button} p-2 rounded-xl transition-all duration-200 hover:scale-105`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
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
                          className={`flex-1 ${currentTheme.glass} ${currentTheme.text} placeholder-current placeholder-opacity-50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm md:text-base transition-all`}
                          autoFocus
                        />
                        <button
                          onClick={() => addSubtask(task.id)}
                          className={`${currentTheme.button} px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subtasks */}
                  {expandedTasks[task.id] && task.subtasks && task.subtasks.length > 0 && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                      {task.subtasks.map((subtask, subIndex) => (
                        <div
                          key={subtask.id}
                          draggable={editingSubtask?.subtaskId !== subtask.id}
                          onDragStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, subIndex, true, task.id);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDrop(e, subIndex, true, task.id);
                          }}
                          className={`ml-8 flex items-center gap-2 md:gap-3 p-3 rounded-xl ${currentTheme.glass} hover:bg-white/5 transition-all`}
                        >
                          {editingSubtask?.subtaskId !== subtask.id && (
                            <>
                              <div className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
                                <GripVertical size={16} />
                              </div>
                              <button
                                onClick={() => toggleSubtask(task.id, subtask.id)}
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                                  subtask.completed ? `${currentTheme.accent} border-transparent` : 'border-current'
                                } flex items-center justify-center transition-all duration-300 hover:scale-110`}
                              >
                                {subtask.completed && <Check size={12} className="text-white" />}
                              </button>
                            </>
                          )}
                          
                          {editingSubtask?.subtaskId === subtask.id ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, saveSubtaskEdit)}
                              onBlur={saveSubtaskEdit}
                              className={`flex-1 ${currentTheme.glass} ${currentTheme.text} rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm md:text-base`}
                              autoFocus
                            />
                          ) : (
                            <span className={`flex-1 text-sm md:text-base transition-all duration-300 ${subtask.completed ? 'line-through opacity-50' : ''}`}>
                              {subtask.text}
                            </span>
                          )}

                          {editingSubtask?.subtaskId !== subtask.id && (
                            <>
                              <button
                                onClick={() => startEditSubtask(task.id, subtask)}
                                className={`flex-shrink-0 ${currentTheme.button} p-1.5 rounded-lg transition-all duration-200 hover:scale-105`}
                                title="Edit subtask"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => deleteSubtask(task.id, subtask.id)}
                                className={`flex-shrink-0 ${currentTheme.button} p-1.5 rounded-lg transition-all duration-200 hover:scale-105`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
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
    </div>
  );
}