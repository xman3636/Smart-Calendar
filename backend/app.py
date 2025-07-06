# # CURRENTLY
# add/get/delete works
# however in the front end i now need to convert from local storage to the backend storage

# To activate vm: . .venv/bin/activate
# Then to deactivate: deactivate
# to run: flask --app app run
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__) # create instance of flask class
CORS(app)  # enable CORS for all routes

def initialize_db():
    with sqlite3.connect('tasks.db', check_same_thread=False) as conn:
        cursor = conn.cursor()
        # Create the tasks table if it does not exist
        cursor.execute("""CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT
            title TEXT,
            month INTEGER, 
            day INTEGER,
            year INTEGER,
            checked INTEGER, -- 0 for false, 1 for true
            type TEXT,
            monthly INTEGER,  -- -1 if no
            weekly INTEGER,  -- -1 if no
        )""")
        conn.commit()
    

@app.route("/")
def hello_world():
    print("Hello World!")  # print to console
    return "hello worlds"

@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json() # get the JSON data from the request
    print(data)
    data_string = json.dumps(data)  # convert the data to a JSON string

    with sqlite3.connect('tasks.db', check_same_thread=False) as conn:  # connect to the database
        cursor = conn.cursor()  # create a cursor object to execute SQL commands

        # retrieve task details from the request data
        title = data.get("title")
        print("title: " + title)
        month = data.get("month")
        day = data.get("day")
        print("day: " + str(day))
        year = data.get("year")
        checked = data.get("checked")
        task_type = data.get("type")
        monthly = data.get("monthly")
        weekly = data.get("weekly")
        print("monthly: " + str(monthly))
        #id = data.get("id")

        # cursor.executemany("""
        #     INSERT INTO tasks (title, month, day, year, checked, type, monthly, weekly, id)
        #     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        # """, [(title, month, day, year, checked, task_type, monthly, weekly, task_id)])
        
        # cursor.executemany("INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", data)

        insert_query = """INSERT INTO tasks (title, month, day, year, checked, type, monthly, weekly) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"""
        cursor.execute(insert_query, (title, month, day, year, checked, task_type, monthly, weekly))  # insert the task into the database
        conn.commit()  # commit the changes to the database

        #conn.close()  # close the connection to the database
    
    return jsonify({"message": "Task created successfully"})  # return a success message

@app.route("/tasks", methods=["GET"])
def get_tasks():
    with sqlite3.connect('tasks.db', check_same_thread=False) as conn:
        cursor = conn.cursor()  # create a cursor object to execute SQL commands
        cursor.execute("SELECT * FROM tasks")  # select all tasks from the database
        print(cursor.fetchall())
        #conn.close()  # close the connection to the database
        return jsonify({"message": "Task retrieved successfully", "tasks": cursor.fetchall()})  # return the tasks as JSON
    
@app.route("/tasks", methods=["DELETE"])
def delete_all():
    with sqlite3.connect('tasks.db', check_same_thread=False) as conn:
        cursor = conn.cursor()  # create a cursor object to execute SQL commands
        cursor.execute("DELETE FROM tasks")  # select all tasks from the database
        return jsonify({"message": "All tasks deleted"})  # return the tasks as JSON


if __name__ == "__main__":
    initialize_db()  # initialize the database
    app.run(debug=True)  # run the app in debug mode
