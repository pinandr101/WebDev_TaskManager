class ToDoListManager{
  constructor(){
    this.toDoListElement = document.getElementById("toDoList");
    this.doneListElement = document.getElementById("doneList");
    this.addTaskButton = document.getElementById("addTaskButton");
    this.dialog = document.getElementById("addTaskDialog");
    this.taskTitleInput = document.getElementById("taskTitle");
    this.taskDescriptionInput = document.getElementById("taskDescription");
    this.taskDueDateInput = document.getElementById("taskDueDate");
    this.cancelButton = document.getElementById("cancelButton");
    this.saveButton = document.getElementById("saveButton");
    this.tasks = [];
    this.initListeners();
    this.loadFromLocalStorage();
    this.renderTasks();
  }

  initListeners(){
    this.addTaskButton.addEventListener("click", () =>{
      this.clearDialog();
      this.dialog.showModal();
    });
    this.cancelButton.addEventListener("click", () =>{
      this.dialog.close();
    });
    this.saveButton.addEventListener("click", () =>{
      this.saveTask();
      this.renderTasks();
      this.dialog.close();
    }); 
    this.taskDueDateInput.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
    this.taskDueDateInput.addEventListener('paste', (e) => {
      e.preventDefault();
    });
  }

  clearDialog(){
    this.taskTitleInput.value = "";
    this.taskDescriptionInput.value = "";
    this.taskDueDateInput.value = "";
  }

  saveTask(){
    const task = {
      id: Date.now().toString(),
      title: this.taskTitleInput.value,
      description: this.taskDescriptionInput.value,
      dueDate: this.taskDueDateInput.value,
      completed: false
    };
    this.tasks.push(task);
    this.saveToLocalStorage();
  }

  saveToLocalStorage(){
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage(){
    try{
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks){
        this.tasks = JSON.parse(savedTasks);
      }
      else{
        this.tasks = [];
        console.log("No save");
      }
    } catch(error){
      console.error("Error", error);
      this.tasks = [];
    }
  }

  renderTasks(){
    this.toDoListElement.innerHTML = "<h2>To Do</h2>";
    this.doneListElement.innerHTML = "<h2>Done</h2>";

    const toDoTasks = this.tasks.filter(task => !task.completed);
    const doneTasks = this.tasks.filter(task => task.completed);

    toDoTasks.forEach(task =>{
      const taskElement = this.createTaskElement(task);
      this.toDoListElement.append(taskElement);
    });

    doneTasks.forEach(task =>{
      const taskElement = this.createTaskElement(task);
      this.doneListElement.append(taskElement);
    })

    if (toDoTasks.length == 0){
      this.toDoListElement.innerHTML += "<p>No active tasks.</p>";
    }

    if (doneTasks.length == 0){
      this.doneListElement.innerHTML += "<p>No done tasks yet.</p>";
    }
  }

  createTaskElement(task){
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";
    taskDiv.dataset.id = task.id;

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description || "";

    const dueDate = document.createElement("span");
    dueDate.textContent = task.dueDate || "";
    dueDate.className = "due-date";

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "task-buttons";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = task.completed ? "Undone" : "Mark as done";
    toggleButton.addEventListener("click", () => this.toggleTaskButton(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this.deleteTask(task.id))

    buttonsDiv.appendChild(toggleButton);
    buttonsDiv.appendChild(deleteButton);

    taskDiv.appendChild(title);
    taskDiv.appendChild(description);
    taskDiv.appendChild(dueDate);
    taskDiv.appendChild(buttonsDiv);

    return taskDiv;
  }

  deleteTask(id){
    this.tasks = this.tasks.filter(task => !(task.id == id));
    this.saveToLocalStorage();
    this.renderTasks();
  }

  toggleTaskButton(id){
    const task = this.tasks.find(task => task.id == id);
    if (task){
      task.completed = !task.completed;
    }
    this.saveToLocalStorage();
    this.renderTasks();
  }
}

document.addEventListener("DOMContentLoaded", () =>{
  new ToDoListManager();
})