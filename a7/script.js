const taskForm = document.querySelector("#taskForm");
const taskCategory = document.querySelector("#Category");
const taskTitle = document.querySelector("#taskTitle");

const taskListContainer = document.querySelector("#taskListContainer");
const clearAllBtn = document.querySelector("#clearAllBtn");
const themeToggle = document.querySelector("#themeToggle");

const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

const searchBar = document.querySelector("#searchBar");
const filterCategory = document.querySelector("#filterCategory");

let tasks = JSON.parse(localStorage.getItem("dom_tasks")) || [];

function Ui() {
  taskListContainer.innerHTML = "";

  const searchTerms = searchBar ? searchBar.value.toLowerCase() : "";
  const categoryFilter = filterCategory ? filterCategory.value : "all";

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerms);
    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const fragment = document.createDocumentFragment();

  filteredTasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("task-card");

    card.setAttribute("data-id", task.id);
    card.setAttribute("data-status", task.status);
    card.dataset.category = task.category;

    const titleElement = document.createElement("h3");
    titleElement.classList.add("task-title");
    const titleText = document.createTextNode(task.title);
    titleElement.appendChild(titleText);

    const categorytype = document.createElement("div");
    categorytype.classList.add("task-type");
    categorytype.innerHTML = `<span><strong>Category:</strong> ${task.category}</span>`;

    const actionsWrapper = document.createElement("div");
    actionsWrapper.classList.add("task-actions");

    const editBtn = document.createElement("button");
    editBtn.className = "thm-btn action-edit";
    editBtn.textContent = "Edit";

    const compBtn = document.createElement("button");
    compBtn.className = "thm-btn action-complete";
    compBtn.textContent = task.status === "completed" ? "Undo" : "Complete";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "thm-btn action-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.style.color = "var(--delete-color)";

    actionsWrapper.append(editBtn, compBtn, deleteBtn);

    card.append(titleElement, categorytype, actionsWrapper);
    fragment.appendChild(card);
  });

  taskListContainer.appendChild(fragment);
  updateCounters();
  localStorage.setItem("dom_tasks", JSON.stringify(tasks));
}

function updateCounters() {
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  if (pendingCount) pendingCount.textContent = pending;
  if (completedCount) completedCount.textContent = completed;
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const category = taskCategory.value;
  if (!title) return;

  const newTask = {
    id: "task_" + Date.now(),
    title: title,
    category: category,
    status: "pending",
  };

  tasks.push(newTask);
  Ui();

  taskTitle.value = "";
});

taskListContainer.addEventListener("click", (e) => {
  const target = e.target;

  const taskCard = target.closest(".task-card");
  if (!taskCard) return;

  const taskId = taskCard.getAttribute("data-id");
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) return;

  if (target.classList.contains("action-delete")) {
    tasks.splice(taskIndex, 1);
    Ui();
  }

  if (target.classList.contains("action-complete")) {
    tasks[taskIndex].status =
      tasks[taskIndex].status === "pending" ? "completed" : "pending";
    Ui();
  }

  if (target.classList.contains("action-edit")) {
    const newTitle = prompt("Edit Title:", tasks[taskIndex].title);
    if (newTitle && newTitle.trim() !== "") {
      tasks[taskIndex].title = newTitle.trim();
      Ui();
    }
  }
});

if (searchBar) searchBar.addEventListener("input", Ui);
if (filterCategory) filterCategory.addEventListener("change", Ui);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = themeToggle.getAttribute("data-current-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", targetTheme);
    themeToggle.setAttribute("data-current-theme", targetTheme);

    if (targetTheme === "dark") {
      document.body.classList.add("dark-mode-active");
    } else {
      document.body.classList.remove("dark-mode-active");
    }
  });
}

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  Ui();
});

Ui();
