document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
  
  const taskForm = document.querySelector("#taskForm");
  
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskForm["title"].value;
    const description = taskForm["description"].value;
    App.createTask(title, description);
  });