const authMessage = document.getElementById("authMessage");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const taskSection = document.querySelector(".task");
const taskListSection = document.querySelector(".task-list");
const notificationsSection = document.querySelector(".notifications");

let token = "";
let socket = null;

// --- AUTH FUNCTIONS ---
async function registerUser(name, email, password) {
  try {
    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Register error");
    token = data.token;
    postLoginSetup();
  } catch(err) {
    authMessage.innerText = err.message;
  }
}

async function loginUser(email, password) {
  try {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login error");
    token = data.token;
    postLoginSetup();
  } catch(err) {
    authMessage.innerText = err.message;
  }
}

// --- AFTER LOGIN SETUP ---
function postLoginSetup() {
  authMessage.innerText = "Giriş başarılı!";
  taskSection.classList.remove("hidden");
  taskListSection.classList.remove("hidden");
  notificationsSection.classList.remove("hidden");

  socket = io("http://localhost:5001");
  socket.on("taskNotification", data => {
    const li = document.createElement("li");
    li.innerText = `${data.message} - ${data.task.title}`;
    document.getElementById("notifications").prepend(li);
  });

  fetchTasks();
}

// --- TASK FUNCTIONS ---
async function fetchTasks() {
  const res = await fetch("http://localhost:5001/api/tasks", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const tasks = await res.json();
  const list = document.getElementById("tasksList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerText = `${task.title} (${task.status})`;
    list.appendChild(li);
  });
}

async function createTask(title, description) {
  const res = await fetch("http://localhost:5001/api/tasks", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });
  const task = await res.json();
  if (res.ok) {
    fetchTasks();
  } else {
    alert(task.message || "Görev eklenemedi");
  }
}

// --- EVENT LISTENERS ---
registerBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  registerUser(name, email, password);
});

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  loginUser(email, password);
});

document.getElementById("createTaskBtn").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  if (!title) return alert("Başlık boş olamaz!");
  createTask(title, description);
});