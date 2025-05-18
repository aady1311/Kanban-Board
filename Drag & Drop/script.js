document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');
    const lists = document.querySelectorAll(".list");
    const doneList = document.getElementById('list3');

    // Counter for unique card IDs
    let cardCounter = 1;

    // Load existing tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length > 0) {
        todoList.style.display = "block";
    }
    tasks.forEach(task => {
        renderTask(task);
    });

    // Add Task Button Event
    addTaskButton.addEventListener('click', function () {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: 'card-' + cardCounter++,
            text: taskText,
            completed: false,
            listId: 'todo-list' // Default to 'To-Do' list
        };

        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = "";
    });

    // Render Task Function
    function renderTask(task) {
        const li = document.createElement("li");
        li.classList.add("card");
        li.setAttribute("draggable", "true");
        li.setAttribute("id", task.id);

        if (task.completed) li.classList.add("completed");

        // Create Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        deleteButton.classList.add("delete-button");
        deleteButton.style.display = task.listId === "list3" ? "inline-block" : "none";

        const taskSpan = document.createElement("span");
        taskSpan.textContent = task.text;

        li.appendChild(taskSpan);
        li.appendChild(deleteButton);

        // Delete button event
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks = tasks.filter((t) => t.id !== task.id);
            li.remove();
            saveTasks();
            if (tasks.length === 0) {
                todoList.style.display = "none";
            }
        });

        // Drag event listeners
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragend", dragEnd);

        // Append to the correct list
        const listElement = document.getElementById(task.listId);
        if (listElement) {
            listElement.appendChild(li);
        }
    }

    // Save Tasks to LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Drag and Drop Logic
    function dragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
    }

    function dragEnd() {
        console.log("Drag ended");
    }

    lists.forEach(list => {
        list.addEventListener("dragover", dragOver);
        list.addEventListener("dragenter", dragEnter);
        list.addEventListener("dragleave", dragLeave);
        list.addEventListener("drop", dragDrop);
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add("over");
    }

    function dragLeave() {
        this.classList.remove("over");
    }

    function dragDrop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(id);

        if (card) {
            this.appendChild(card);

            // Find the task and update its listId
            tasks = tasks.map(task => {
                if (task.id === id) {
                    task.listId = this.id;
                }
                return task;
            });

            // Update the delete button visibility
            const deleteButton = card.querySelector(".delete-button");
            if (this.id === "list3") {
                deleteButton.style.display = "inline-block";
            } else {
                deleteButton.style.display = "none";
            }

            saveTasks();
        }

        this.classList.remove("over");
    }
    
});
