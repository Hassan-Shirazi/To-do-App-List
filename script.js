
        document.addEventListener('DOMContentLoaded', () => {
            const newTaskForm = document.getElementById('new-task-form');
            const newTaskInput = document.getElementById('new-task-input');
            const tasksContainer = document.getElementById('tasks');
            const dateElement = document.getElementById('date');
            const taskCountElement = document.getElementById('task-count');
            const filterButtons = document.querySelectorAll('#task-filters button');

            // --- STATE ---
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';

            // --- DATE DISPLAY ---
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = new Date().toLocaleDateString('en-US', options);

            // --- RENDER FUNCTION ---
            const renderTasks = () => {
                tasksContainer.innerHTML = '';
                
                const filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                    return true;
                });

                if (filteredTasks.length === 0) {
                    tasksContainer.innerHTML = `<p style="color: var(--text-muted-color); text-align: center; padding: 1rem 0;">No tasks here. Add one above!</p>`;
                } else {
                    filteredTasks.forEach(task => {
                        const taskElement = document.createElement('div');
                        taskElement.classList.add('task');
                        if (task.completed) {
                            taskElement.classList.add('completed');
                        }
                        taskElement.dataset.id = task.id;

                        taskElement.innerHTML = `
                            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="content">${task.text}</span>
                            <div class="actions">
                                <button class="delete" title="Delete task">✖</button>
                            </div>
                        `;
                        tasksContainer.appendChild(taskElement);
                    });
                }
                updateSummary();
            };

            // --- UPDATE SUMMARY ---
            const updateSummary = () => {
                const pendingTasks = tasks.filter(t => !t.completed).length;
                taskCountElement.textContent = pendingTasks;
            };

            // --- SAVE TO LOCAL STORAGE ---
            const saveTasks = () => {
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            };
            
            // --- ADD NEW TASK ---
            newTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const taskText = newTaskInput.value.trim();
                if (taskText) {
                    const newTask = {
                        id: Date.now(),
                        text: taskText,
                        completed: false
                    };
                    tasks.push(newTask);
                    newTaskInput.value = '';
                    newTaskInput.focus();
                    saveTasks();
                }
            });

            // --- HANDLE TASK ACTIONS (COMPLETE/DELETE) ---
            tasksContainer.addEventListener('click', (e) => {
                const target = e.target;
                const taskElement = target.closest('.task');
                if (!taskElement) return;

                const taskId = Number(taskElement.dataset.id);
                
                // Toggle complete
                if (target.classList.contains('checkbox')) {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task.completed = !task.completed;
                        saveTasks();
                    }
                }
                
                // Delete task
                if (target.classList.contains('delete')) {
                    tasks = tasks.filter(t => t.id !== taskId);
                    saveTasks();
                }
            });

            // --- HANDLE FILTERS ---
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    currentFilter = button.dataset.filter;
                    renderTasks();
                });
            });


            // --- INITIAL RENDER ---
            renderTasks();
        });