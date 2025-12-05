from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# Database setup
conn = sqlite3.connect('tasks.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL
)
""")
conn.commit()

# Home route: display tasks
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        task_text = request.form['task']
        cursor.execute("INSERT INTO tasks (task) VALUES (?)", (task_text,))
        conn.commit()
        return redirect('/')
    
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return render_template('index.html', tasks=tasks)

# Delete task route
@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    cursor.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    conn.commit()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)