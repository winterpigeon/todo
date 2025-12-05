# 🔥 iOS Frosted Glass To-Do List

A beautiful, feature-rich to-do list application with an iOS-inspired frosted glass (glassmorphism) UI. Built with React and featuring stunning visual themes, smooth animations, and powerful task management capabilities.

![To-Do App Preview]

## ✨ Features

### 🎨 Beautiful UI/UX
- **6 Stunning Themes**: Color Splash, Midnight, Beach Vibes, Forest Green, Galaxy Dark, and Calm Blue
- **iOS Liquid Glass Effect**: Frosted glass morphism with backdrop blur and elegant transparency
- **Smooth Animations**: Buttery smooth transitions and hover effects
- **Fully Responsive**: Optimized layouts for both mobile and desktop screens

### 📝 Task Management
- **Hierarchical Tasks**: Create main tasks with unlimited subtasks
- **Smart Auto-Completion**: 
  - Completing all subtasks automatically completes the main task
  - Completing a main task completes all its subtasks
- **Drag & Drop Reordering**: Reorder both tasks and subtasks with intuitive drag-and-drop
- **Inline Editing**: Edit tasks and subtasks directly with a single click
- **Quick Actions**: Add, edit, complete, and delete with beautiful button interactions

### 🎯 Productivity Features
- **Live Productivity Score**: Real-time calculation based on task completion (🔥 emoji included!)
  - Tasks without subtasks: 100% when completed
  - Tasks with subtasks: Calculated as percentage of completed subtasks
- **Task Counter**: Always know how many tasks remain
- **Celebration Animations**: Motivating fire animations and compliments when you complete tasks!

### 💾 Data Persistence
- **LocalStorage Integration**: All tasks automatically saved to browser storage
- **No Database Required**: Simple, fast, and privacy-focused
- **Cross-Session Persistence**: Your tasks are there when you return

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ios-todo-app.git
cd ios-todo-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install required packages**
```bash
npm install lucide-react
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Deploy! 🚀

### Netlify
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop your `build` folder
4. Done! ✨

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/ios-todo-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
3. Run: `npm run deploy`

## 🎮 Usage Guide

### Adding Tasks
1. Type your task in the input field at the top
2. Press **Enter** or click the **+** button
3. New tasks appear at the top of the list

### Adding Subtasks
1. Click the **+** icon next to any task
2. Type your subtask and press **Enter**
3. Subtasks appear nested under the main task

### Editing Tasks
1. Click the **pencil icon** (✏️) next to any task or subtask
2. Edit the text inline
3. Press **Enter** or click outside to save

### Reordering
- **Drag** any task or subtask by the grip handle (⋮⋮)
- **Drop** it in the desired position

### Completing Tasks
- Click the **checkbox** next to any task or subtask
- Watch the celebration animation! 🔥
- Completing all subtasks auto-completes the main task

### Changing Themes
1. Click the **palette icon** in the header
2. Select your favorite theme
3. Your choice is saved automatically

## 🛠️ Technology Stack

- **React** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set
- **LocalStorage API** - Data persistence
- **HTML5 Drag and Drop API** - Reordering functionality

## 📊 Data Structure

Tasks are stored in localStorage with the following structure:

```javascript
{
  id: timestamp,
  text: "Task name",
  completed: boolean,
  subtasks: [
    {
      id: timestamp,
      text: "Subtask name",
      completed: boolean
    }
  ]
}
```

## 🎨 Theme Customization

Each theme includes:
- `bgImage`: Background gradient image URL
- `glass`: Frosted glass styling
- `text`: Text color
- `button`: Button styling
- `accent`: Accent color for completed items

To add a new theme, edit the `themes` object in the component:

```javascript
customTheme: {
  name: 'My Theme',
  bgImage: 'https://your-image-url.jpg',
  glass: 'bg-white/30 backdrop-blur-2xl border-2 border-white/80',
  text: 'text-white',
  button: 'bg-white/15 hover:bg-white/25 text-white',
  accent: 'bg-blue-500/80 backdrop-blur-sm'
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



Made with ❤️

⭐ Star this repo if you found it helpful!
