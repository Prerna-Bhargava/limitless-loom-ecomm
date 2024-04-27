class Task:
    def __init__(self, id, title, done=False):
        self.id = id
        self.title = title
        self.done = done

tasks = [
    Task(1, 'Learn Python'),
    Task(2, 'Build a Flask API')
]

def get_all_tasks():
    return tasks

def get_task_by_id(task_id):
    return next((task for task in tasks if task.id == task_id), None)

def create_task(title):
    new_task = Task(id=len(tasks) + 1, title=title)
    tasks.append(new_task)
    return new_task
