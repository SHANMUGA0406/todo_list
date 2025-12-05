// Load tasks when page opens
window.onload = function () {
    loadTasks();
};

// Load tasks from backend
function loadTasks() {
    fetch("/get_tasks")
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";

            tasks.forEach(task => {
                let li = document.createElement("li");
                li.innerHTML = `
                    ${task.task}
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        });
}

// Add a new task
function addTask() {
    let taskText = document.getElementById("taskInput").value;

    if (taskText.trim() === "") {
        alert("Enter a task!");
        return;
    }

    fetch("/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText })
    })
    .then(() => {
        document.getElementById("taskInput").value = "";
        loadTasks();
    });
}

// Delete a task
function deleteTask(id) {
    fetch("/delete_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(() => {
        loadTasks();
    });
}