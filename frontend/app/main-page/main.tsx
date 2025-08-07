// TODO: take care of delete function

import { useState, useEffect } from "react"; 
import axios from "axios";
import MyDropdown from "../components/MyDropdown";
import ListScreen from "./list-screen";
import AddScreen from "./add-screen"

export function Main() {
    let randID = 0; 
    // task object
    type Task = {
        id: number; 
        title: string;
        month: number; 
        day: number;
        year: number;
        checked: number;
        type: string;
        monthly: number; // -1 if no
        weekly: number; // 
    };

    // functions:
    //const todaysDate = retrieveTodaysDate(); 
    let date = getDate(); 
    const monthOrWeek: string[] = ["Niether", "Monthly", "Weekly"]
    // States:
    // Have a state for a list of todo items, i can use .filter to query for certain tasks
    const [loading, setLoading] = useState(true)
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

    const [nextCounter, setNextCounter] = useState(0); // will keep track of the day to be displayed
    

    const convertObjectToTask = (object) => {
         const newTask: Task = {
            id: object[0], // flask the backend can handle this
            title: object[1],
            month: object[2], // the actual month is stored, not the indexed version
            day: object[3], 
            year: object[4],
            checked: object[5],
            type: object[6],
            monthly: object[7], // -1 if no repeat, a number 1-31 if repeating
            weekly: object[8], // -1 if no repeat, a number 0-6 if repeating
        };
        return newTask
    }

    useEffect(() => {
        // Fetch tasks from the backend when the component mounts
        axios.get("http://127.0.0.1:5000/tasks") 
            .then(response => {
                const dataFromTable: Task[] = [];
                for (let i = 0; i < response.data.length; i++)
                {
                    dataFromTable.push(convertObjectToTask(response.data[i]))
                    console.log("title: ")
                    console.log(dataFromTable[i].title)
                }

                setTodoList(dataFromTable)
                setLoading(false)
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
                setLoading(false)
            });
    }, [])

    const navigateToAddClick = () => {
        setCurrRightSide("add");
    }
    const navigateToListClick = () => {
        setCurrRightSide("list");
    }
    const navigateToNextClick = () => {
        setCurrRightSide("next");
    }
    // final add task button handler
    const addTaskButtonHandler = async () => {
        // date info for the given task
        var tmonth;
        var tday;
        var tyear;
        // the following two are only changed if a repeating option is selected
        var repeatOnDay = -1
        var repeatOnDayOfWeek = -1
        if (isTodayChecked) // use todays dates
        {
            let upcomingDay = new Date()
            let specifiedDay = upcomingDay.getDate() + nextCounter
            upcomingDay.setDate(specifiedDay)
            tmonth = (upcomingDay.getMonth() + 1)
            tday = upcomingDay.getDate()
            tyear = upcomingDay.getFullYear()

        }
        else // use inputted dates
        {
            tmonth = parseInt(currTaskDate.substring(5, 7))
            tday = parseInt(currTaskDate.substring(8, 10))
            tyear = parseInt(currTaskDate.substring(0, 4))

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
        let newTask: Task = {
            id: Math.random(), // FIXME: when i implement flask the backend can handle this
            title: currTaskName,
            month: tmonth, // the actual month is stored, not the indexed version
            day: tday, 
            year: tyear,
            checked: 0,
            type: "default",
            monthly: repeatOnDay, // -1 if no repeat, a number 1-31 if repeating
            weekly: repeatOnDayOfWeek, // -1 if no repeat, a number 0-6 if repeating
        };
        let newId = -1
        // send the new task to the backend
        await axios.post("http://127.0.0.1:5000/tasks", newTask)
            .then(response => {
                console.log("Task added successfully:", response.data);
                newId = parseInt(response.data)
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });
        newTask.id = newId
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
        console.log("selected id :" + id)
        const selectedTaskOg = todoList.find(t => t.id === id) // should probbaly change the original one too
        const selectedTaskLi = document.getElementById(id.toString())
        if (selectedTaskOg?.checked === 1) // task has already been selected, change to not selected
        {
            selectedTaskLi?.classList.remove("before:bg-red-400")
            selectedTaskLi?.classList.add("before:bg-white") // change to default
            selectedTaskOg.checked = 0;
        }
        else // change to selected 
        {
            selectedTaskLi?.classList.remove("before:bg-white")
            selectedTaskLi?.classList.add("before:bg-red-400")
            selectedTaskOg.checked = 1;
        }
    }

    const deleteButtonHandler = async () => {
        console.log("delete button handler")
        console.log(todoList)
        let idnums: number[] = []
        const checked = todoList.filter(t => t.checked === 1)
        const unchecked = todoList.filter(t => t.checked === 0)
        for (let i = 0; i < checked.length; i++) // fill out idNums with the ids of all tasks that will be deleted
        {
            idnums.push(checked[i].id)
        }
        await axios.delete("http://127.0.0.1:5000/tasks/delete-some", {
            data : {
                ids: idnums
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.error(error)
        })
        console.log("checked")
        console.log(checked)
        console.log("unchecked")
        console.log(unchecked)
        // TODO: delete is working and this method successfully deletes tasks from the backend table, however its not automatically being displayed on the frontend. 
        idnums = []
        setTodoList(unchecked)
    }
    
    // can be used to retrieve an array full of the tasks for a given date
    function getTodaysTasks(todoList: Task[], date: Date): Task[] {
        if (todoList.length === 0)
        {
            return []
        }
        // lists for daily tasks 
        // let testDate = new Date(2025, 6, 15) // month has to be indexed here
        console.log(todoList[0].day)
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
     
    // fucntion is used to create a list of the upcoming tasks for the next x amount of days
    function getUpcomingTasks(todoList: Task[], date: Date): Task[] {
        if (todoList.length === 0)
        {
            return []
        }


        return []
    }
    // renders the left side
    const leftSideRender = () => {
        return (
            <div className="h-screen w-1/3 bg-[#3C3D42] relative shadow-[4px_0_15px_rgba(0,0,0,.5)]" >
                <div className="flex flex-col gap-3">
                    <div className="p-1">                        
                        {retrieveTodaysDate()}
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white h-13 w-50">Photo Mode</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white h-13 w-50">Wordle</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-gradient-to-r from-red-600  to-red-700 rounded-2xl text-white h-13 w-50">AI Summary</button>
                    </div>
                </div>        
            </div>

        )
    }

    // switch function to handle the right side
    const rightSideRender = () => {
        switch (currRightSide) {
            case "list":
                // console.log("before render call")
                // console.log(todoList)
                return <ListScreen
                        getTodaysTasks={getTodaysTasks}
                        todoList={todoList}
                        date={date}
                        navigateToAddClick={navigateToAddClick}
                        deleteButtonHandler={deleteButtonHandler}
                        taskClickHandler={taskClickHandler}
                        nextCounter={nextCounter}
                        setNextCounter={setNextCounter}
                        Task
                        />
            case "add":
                // return addScreen();
                return <AddScreen
                        navigateToListClick={navigateToListClick}
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
            {loading ? <div>laoding</div> : rightSideRender() /* Will determine which screen to render*/}
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
            <p className="text-white font-semibold text-4xl pt-1 pl-1">{today.toLocaleTimeString('en-US', { timeStyle: 'short'})}</p>
            <p className="text-white text-2xl pt-1 pl-1">{formattedDate}</p>
        </div>
    );
}
