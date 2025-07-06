// TODO: need to convert the local storage to the backend storage

import { useState, useEffect } from "react"; 
import axios from "axios";
import MyDropdown from "../components/MyDropdown";
import ListScreen from "./list-screen";
import AddScreen from "./add-screen"

export function Main() {
    let randID = 0; 
    // task object
    type Task = {
        title: string;
        month: number; 
        day: number;
        year: number;
        checked: boolean;
        type: string;
        monthly: number; // -1 if no
        weekly: number; // 
        id: number; // YYYYMMDD#
    };

    // functions:
    //const todaysDate = retrieveTodaysDate(); 
    const date = getDate(); 
    const monthOrWeek: string[] = ["Niether", "Monthly", "Weekly"]
    // States:
    // Have a state for a list of todo items, i can use .filter to query for certain tasks
    const [todoList, setTodoList] = useState<Task[]>([]);
    //const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);

    // keeps track of the task name that will be added
    const [currTaskName, setCurrTaskName] = useState("");
    // same but for date
    const [currTaskDate, setCurrTaskDate] = useState(""); 
    // currRightSide keeps track of the screen to be displayed on the right side of the default page
    const [currRightSide, setCurrRightSide] = useState("list")
    const [isTodayChecked, setIsTodayChecked] = useState(false);
    const [monthlyOrWeeklyCheck, setMonthlyOrWeeklyCheck] = useState<string>(''); 

    useEffect(() => {
        // Fetch tasks from the backend when the component mounts
        axios.get("http://127.0.0.1:5000/tasks") 
            .then(response => {
                console.log(response.data.tasks);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });
    }, [])


    const navigateToAddClick = () => {
        setCurrRightSide("add");
    }
    // final add task button handler
    const addTaskButtonHandler = () => {
        // date info for the given task
        var tmonth;
        var tday;
        var tyear;
        // the following two are only changed if a repeating option is selected
        var repeatOnDay = -1
        var repeatOnDayOfWeek = -1
        if (isTodayChecked) // use todays dates
        {
            tmonth = (date.getMonth() + 1)
            tday = date.getDate()
            tyear = date.getFullYear()

            console.log("month: " + tmonth);
            console.log("day: " + tday);
            console.log("year: " + tyear);
        }
        else // use inputted dates
        {
            tmonth = parseInt(currTaskDate.substring(5, 7))
            tday = parseInt(currTaskDate.substring(8, 10))
            tyear = parseInt(currTaskDate.substring(0, 4))
            // prints arent padded with 0
            console.log("month: " + tmonth);
            console.log("day: " + tday);
            console.log("year: " + tyear);


        }
        // Handle if repeating is checked
        // Monthly
        if (monthlyOrWeeklyCheck === "Monthly") // task should repeat every month
        {
            // change repeatOnDay var to the day of task
            repeatOnDay = tday
        }
        else if (monthlyOrWeeklyCheck === "Weekly") // task should repeat every week
        {
            // change weekly to the day of week
            // can can use tempDate to find the day of week for the task: 0-sun 6-sat
            let tempDate = new Date(tyear, (tmonth-1),  tday)
            repeatOnDayOfWeek = tempDate.getDay()

        }
        // create task object
        const newTask: Task = {
            title: currTaskName,
            month: tmonth, // the actual month is stored, not the indexed version
            day: tday, 
            year: tyear,
            checked: false,
            type: "default",
            monthly: repeatOnDay, // -1 if no repeat, a number 1-31 if repeating
            weekly: repeatOnDayOfWeek, // -1 if no repeat, a number 0-6 if repeating
            id: Math.random(), // FIXME: when i implement flask the backend can handle this
        };
        // send the new task to the backend
        axios.post("http://127.0.0.1:5000/tasks", newTask)
            .then(response => {
                console.log("Task added successfully:", response.data);
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });

        // add new task to the list
        setTodoList([...todoList, newTask])
        // clear input fields
        setIsTodayChecked(false)
        setMonthlyOrWeeklyCheck("Neither")
        // send to list screen 
        setCurrRightSide("list")

    }

    // checkbox handler
    const handleTodayCheckbox = (event) => {
        setIsTodayChecked(event.target.checked)
    }

    // handles when a task is clicked 
    const taskClickHandler = (id: number) => { // id is passed in as a number
        const selectedTaskOg = todoList.find(t => t.id === id) // should probbaly change the original one too
        const selectedTaskLi = document.getElementById(id.toString())
        if (selectedTaskOg?.checked) // task has already been selected, change to not selected
        {
            selectedTaskLi?.classList.remove("before:bg-red-400")
            selectedTaskLi?.classList.add("before:bg-white") // change to default
            selectedTaskOg.checked = false;
        }
        else // change to selected 
        {
            selectedTaskLi?.classList.remove("before:bg-white")
            selectedTaskLi?.classList.add("before:bg-red-400")
            selectedTaskOg.checked = true;
        }
    }

    const deleteButtonHandler = () => {
        
        const eArr = todoList.filter(t => t.checked === false)
        setTodoList(eArr)

    }
    
    function getTodaysTasks(todoList: Task[], date: Date): Task[] {
        // lists for daily tasks 
        let testDate = new Date(2025, 6, 15) // month has to be indexed here
        const montlyTasks = todoList.filter(t => t.monthly === date.getDate()) 
        const weeklyTasks = todoList.filter(t => t.weekly === date.getDay())
        const uniqueTasks = todoList.filter(t => t.year === date.getFullYear() && t.day === date.getDate() && t.month === (date.getMonth()+1))
        const todaysTasks = []; // represents all the tasks for the day
        for (let i = 0; i < montlyTasks.length; i++)
            {
                if ((todaysTasks.filter(t => t.id === montlyTasks[i].id)).length === 0) // current weekly task has yet to be added
                {
                    todaysTasks.push(montlyTasks[i]);
                }
            }
        for (let i = 0; i < weeklyTasks.length; i++)
            {
                if ((todaysTasks.filter(t => t.id === weeklyTasks[i].id)).length === 0) // current weekly task has yet to be added
                {
                    todaysTasks.push(weeklyTasks[i]);
                }
            }
        for (let i = 0; i < uniqueTasks.length; i++)
            {
                if ((todaysTasks.filter(t => t.id === uniqueTasks[i].id)).length === 0) // if id's match then the tasks are duplicates
                {
                    todaysTasks.push(uniqueTasks[i]);
                }
            }
            return todaysTasks;
    }
                
    // renders the left side
    const leftSideRender = () => {
        return (
            <div className="h-screen w-1/3 bg-gray-300 relative">
                <div className="flex flex-col">
                    {retrieveTodaysDate()}
                    <div className="pl-6 pt-2">
                        <button className="bg-blue-400 rounded-2xl h-13 w-50">app 1</button>
                    </div>
                    <div className="pl-6 pt-2">
                        <button className="bg-green-500 rounded-2xl h-13 w-50">app 1</button>
                    </div>
                    <div className="pl-6 pt-2">
                        <button className="bg-red-400 rounded-2xl h-13 w-50">app 1</button>
                    </div>
                </div>        
            </div>

        )
    }

    // switch function to handle the right side
    const rightSideRender = () => {
        switch (currRightSide) {
            case "list":
                //return listScreen();
                return <ListScreen
                        getTodaysTasks={getTodaysTasks}
                        todoList={todoList}
                        date={date}
                        navigateToAddClick={navigateToAddClick}
                        deleteButtonHandler={deleteButtonHandler}
                        taskClickHandler={taskClickHandler}
                        />
            case "add":
                // return addScreen();
                return <AddScreen
                        navigateToListClick={navigateToAddClick}
                        currTaskName={currTaskName}
                        currTaskDate={currTaskDate}
                        setCurrTaskName={setCurrTaskName}
                        setCurrTaskDate={setCurrTaskDate}
                        isTodayChecked={isTodayChecked}
                        handleTodayCheckbox={handleTodayCheckbox}
                        monthOrWeek={monthOrWeek}
                        setMonthlyOrWeeklyCheck={setMonthlyOrWeeklyCheck}
                        addTaskButtonHandler={addTaskButtonHandler}
                        />
        }
    }
    // Main return: 
    return (
        <div className="flex h-screen w-full">
            {/* left side */}
            {leftSideRender()}
            {/* right side */}
            {rightSideRender() /* Will determine which screen to render*/}
        </div>
    )
}

// helper functions: 
// retrieves date
function getDate() {
    const today = new Date();
    return today; 
}
function retrieveTodaysDate() {
    const today = new Date();
    const options = { weekday: "long", month: "long", day: "numeric"};
    const formattedDate = today.toLocaleDateString(undefined, options);
    // console.log("retrieve month: " + today.getMonth() + "\n") // sinlge or double digit
    // console.log("retrieve day: " + today.getDate() + "\n") // same thing
    //     console.log("retrieve day of week: " + today.getDay() + "\n") // same thing

    return (
        <div>
            <p className="text-black text-4xl pt-1 pl-1">{today.toLocaleTimeString('en-US', { timeStyle: 'short'})}</p>
            <p className="text-black text-2xl pt-1 pl-1">{formattedDate}</p>
        </div>
    );
}
