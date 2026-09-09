const state = {
  todos: [],
  currentFilter: "all",
  editingId: null,
};

const STORAGE_KEY = "simple-todo-list";

const elements = {
  todoForm: document.getElementById("todoForm"),
  todoInput: document.getElementById("todoInput"),
  todoList: document.getElementById("todoList"),
  todoCount: document.getElementById("todoCount"),
  emptyState: document.getElementById("emptyState"),
  clearCompleted: document.getElementById("clearCompleted"),
  filterButtons: document.querySelectorAll(".filter-btn"),
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return [];
  }
};

const saveToStorage = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("LocalStorage write error:", error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

const addTodo = (text) => {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const newTodo = {
    id: generateId(),
    text: trimmedText,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  state.todos.unshift(newTodo);
  saveToStorage(state.todos);
  renderTodos();
  updateStats();
};

const deleteTodo = (id) => {
  const todoElement = document.querySelector(`[data-id="${id}"]`);

  if (todoElement) {
    todoElement.style.animation = "slideOut 0.3s ease forwards";

    setTimeout(() => {
      state.todos = state.todos.filter((todo) => todo.id !== id);
      saveToStorage(state.todos);
      renderTodos();
      updateStats();
    }, 300);
  }
};

const toggleTodo = (id) => {
  const todo = state.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveToStorage(state.todos);
    renderTodos();
    updateStats();
  }
};

const startEditTodo = (id) => {
  state.editingId = id;
  renderTodos();

  const editInput = document.querySelector(".todo-edit-input");
  if (editInput) {
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  }
};

const saveEditTodo = (id, newText) => {
  const trimmedText = newText.trim();
  if (!trimmedText) {
    cancelEditTodo();
    return;
  }

  const todo = state.todos.find((t) => t.id === id);
  if (todo) {
    todo.text = trimmedText;
    saveToStorage(state.todos);
  }

  state.editingId = null;
  renderTodos();
};

const cancelEditTodo = () => {
  state.editingId = null;
  renderTodos();
};

const clearCompleted = () => {
  const completedItems = document.querySelectorAll(".todo-item.completed");

  completedItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.animation = "slideOut 0.3s ease forwards";
    }, index * 50);
  });

  setTimeout(
    () => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      saveToStorage(state.todos);
      renderTodos();
      updateStats();
    },
    completedItems.length * 50 + 300,
  );
};

const setFilter = (filter) => {
  state.currentFilter = filter;

  elements.filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  renderTodos();
  updateStats();
};

const getFilteredTodos = () => {
  switch (state.currentFilter) {
    case "active":
      return state.todos.filter((todo) => !todo.completed);
    case "completed":
      return state.todos.filter((todo) => todo.completed);
    default:
      return state.todos;
  }
};

const clearDragIndicators = () => {
  elements.todoList
    .querySelectorAll(".drag-over-top, .drag-over-bottom")
    .forEach((item) => {
      item.classList.remove("drag-over-top", "drag-over-bottom");
    });
};

const handleDragStart = (event) => {
  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) return;

  draggedId = todoItem.dataset.id;
  todoItem.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedId);
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const todoItem = event.target.closest(".todo-item");
  if (!todoItem || todoItem.dataset.id === draggedId) return;

  const rect = todoItem.getBoundingClientRect();
  const isAbove = event.clientY < rect.top + rect.height / 2;

  todoItem.classList.toggle("drag-over-top", isAbove);
  todoItem.classList.toggle("drag-over-bottom", !isAbove);
};

const handleDragLeave = (event) => {
  const todoItem = event.target.closest(".todo-item");
  if (todoItem) {
    todoItem.classList.remove("drag-over-top", "drag-over-bottom");
  }
};

const handleDrop = (event) => {
  event.preventDefault();

  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) return;

  const targetId = todoItem.dataset.id;
  if (!targetId || targetId === draggedId) return;

  const rect = todoItem.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;

  const draggedPos = state.todos.findIndex((todo) => todo.id === draggedId);
  if (draggedPos === -1) return;

  const [draggedTodo] = state.todos.splice(draggedPos, 1);

  const targetPos = state.todos.findIndex((todo) => todo.id === targetId);
  if (targetPos === -1) {
    state.todos.push(draggedTodo);
  } else {
    state.todos.splice(insertAfter ? targetPos + 1 : targetPos, 0, draggedTodo);
  }

  saveToStorage(state.todos);
  renderTodos();
  clearDragIndicators();
};

const handleDragEnd = () => {
  const draggedItem = elements.todoList.querySelector(".dragging");
  if (draggedItem) {
    draggedItem.classList.remove("dragging");
  }
  clearDragIndicators();
  draggedId = null;
};

const createTodoItemHTML = (todo) => {
  const isEditing = state.editingId === todo.id;

  if (isEditing) {
    return `
            <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${todo.id}">
                <input 
                    type="text" 
                    class="todo-edit-input" 
                    value="${escapeHtml(todo.text)}"
                    aria-label="Edit task"
                >
                <div class="todo-actions" style="opacity: 1;">
                    <button class="todo-action-btn save" data-action="save" aria-label="Save">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <button class="todo-action-btn cancel" data-action="cancel" aria-label="Cancel">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </li>
        `;
  }

  return `
        <li class="todo-item ${todo.completed ? "completed" : ""}" 
            data-id="${todo.id}" 
            draggable="true"
            aria-label="${escapeHtml(todo.text)}, ${todo.completed ? "completed" : "active"}">
            <div class="drag-handle" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                </svg>
            </div>
            <label class="todo-checkbox">
                <input 
                    type="checkbox" 
                    ${todo.completed ? "checked" : ""} 
                    data-action="toggle"
                    aria-label="${todo.completed ? "Mark as not completed" : "Mark as completed"}"
                >
            </label>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-action-btn edit" data-action="edit" aria-label="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="todo-action-btn delete" data-action="delete" aria-label="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </li>
    `;
};

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const renderTodos = () => {
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    elements.todoList.innerHTML = "";
    elements.emptyState.classList.add("show");
  } else {
    elements.emptyState.classList.remove("show");
    elements.todoList.innerHTML = filteredTodos
      .map(createTodoItemHTML)
      .join("");

    elements.todoList.querySelectorAll(".todo-item").forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    });
  }
};

const updateStats = () => {
  const total = state.todos.length;
  const active = state.todos.filter((t) => !t.completed).length;
  const completed = state.todos.filter((t) => t.completed).length;

  let countText = "";
  switch (state.currentFilter) {
    case "active":
      countText = `${active} active`;
      break;
    case "completed":
      countText = `${completed} completed`;
      break;
    default:
      countText = `${total} ${total === 1 ? "task" : "tasks"}`;
  }
  elements.todoCount.textContent = countText;

  if (completed > 0) {
    elements.clearCompleted.classList.add("show");
  } else {
    elements.clearCompleted.classList.remove("show");
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const text = elements.todoInput.value;
  addTodo(text);
  elements.todoInput.value = "";
  elements.todoInput.focus();
};

const handleTodoListClick = (event) => {
  const target = event.target;
  const todoItem = target.closest(".todo-item");
  if (!todoItem) return;

  const todoId = todoItem.dataset.id;
  const action = target.closest("[data-action]")?.dataset.action;

  switch (action) {
    case "toggle":
      toggleTodo(todoId);
      break;
    case "delete":
      deleteTodo(todoId);
      break;
    case "edit":
      startEditTodo(todoId);
      break;
    case "save":
      const editInput = todoItem.querySelector(".todo-edit-input");
      if (editInput) {
        saveEditTodo(todoId, editInput.value);
      }
      break;
    case "cancel":
      cancelEditTodo();
      break;
  }
};

const handleEditKeydown = (event) => {
  if (event.target.classList.contains("todo-edit-input")) {
    const todoItem = event.target.closest(".todo-item");
    const todoId = todoItem?.dataset.id;

    if (event.key === "Enter") {
      event.preventDefault();
      saveEditTodo(todoId, event.target.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEditTodo();
    }
  }
};

const handleFilterClick = (event) => {
  const filter = event.target.dataset.filter;
  if (filter) {
    setFilter(filter);
  }
};

const init = () => {
  state.todos = loadFromStorage();

  renderTodos();
  updateStats();

  elements.todoForm.addEventListener("submit", handleFormSubmit);
  elements.todoList.addEventListener("click", handleTodoListClick);
  elements.todoList.addEventListener("keydown", handleEditKeydown);
  elements.todoList.addEventListener("dragover", handleDragOver);
  elements.todoList.addEventListener("dragleave", handleDragLeave);
  elements.todoList.addEventListener("drop", handleDrop);
  elements.clearCompleted.addEventListener("click", clearCompleted);

  elements.filterButtons.forEach((btn) => {
    btn.addEventListener("click", handleFilterClick);
  });

  elements.todoInput.focus();
};

document.addEventListener("DOMContentLoaded", init);
