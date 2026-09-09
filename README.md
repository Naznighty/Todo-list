# 📝 Simple To-Do List

A clean, modern to-do list app built with **vanilla JavaScript**, **HTML**, and **CSS** — no frameworks, no dependencies. Add, edit, complete, reorder, and filter your tasks with a smooth, responsive UI backed by `localStorage`.

🔗 **[Live Demo](#)** <!-- replace # with your GitHub Pages / Netlify / Vercel link -->

<img width="1458" height="744" alt="screenshot" src="https://github.com/user-attachments/assets/99fabf3d-57e0-4a30-b58b-e7f4554c3915" /> <!-- add a screenshot file to the repo and update this path -->

## ✨ Features

- ➕ **Add tasks** quickly with a clean input field
- ✅ **Mark as complete** with a single click
- ✏️ **Edit tasks** inline — save or cancel anytime
- 🗑️ **Delete tasks** individually or clear all completed at once
- 🔀 **Drag & drop** to reorder tasks
- 🔍 **Filter** by All / Active / Completed
- 💾 **Persistent storage** — tasks are saved in `localStorage`, so they survive page reloads
- 📱 **Fully responsive** — works great on mobile and desktop
- ♿ **Accessible** — semantic HTML, ARIA labels, and keyboard support (Enter to save, Escape to cancel)

## 🛠️ Built With

- **HTML5** — semantic structure
- **CSS3** — custom properties (CSS variables), Flexbox/Grid, gradients
- **Vanilla JavaScript (ES6+)** — no libraries or frameworks
- **Google Fonts** — Outfit & JetBrains Mono

## 🚀 Getting Started

### Prerequisites
No build tools or dependencies required — this is a static site.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Naznighty/my-roadmap.git
   ```
2. Navigate to the project folder:
   ```bash
   cd my-roadmap/path-to-todo-project
   ```
3. Open `index.html` in your browser — that's it!

   Or serve it locally for the best experience:
   ```bash
   npx serve .
   ```

## 📂 Project Structure

```
├── index.html      # Markup
├── style.css       # Styling (theming via CSS variables)
├── script.js       # App logic (state, rendering, events)
└── README.md
```

## 🎨 Customization

Colors, spacing, and border radius are controlled through CSS custom properties in `style.css`, making it easy to re-theme the whole app from one place:

```css
:root {
  --bg: #f5f5f5;
  --surface: rgba(20, 10, 15, 0.45);
  --text: #ffffff;
  --accent: #e0507f;
  --radius: 40px;
}
```

## 🗺️ Roadmap / Possible Improvements

- [ ] Task due dates & reminders
- [ ] Categories / tags
- [ ] Dark / light theme toggle
- [ ] Sync with a backend (e.g., Django REST API)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nazanin Rahgozar**
GitHub: [@Naznighty](https://github.com/Naznighty)

---

⭐ If you like this project, consider giving it a star on GitHub!
