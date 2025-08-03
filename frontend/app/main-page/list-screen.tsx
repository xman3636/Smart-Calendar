import React from 'react'
import { useState, useEffect } from "react"; 


// interface listProps {
//     getTodaysTasks;
//     todoList: Task[];
//     date;
//     navigateToAddClick;
//     deleteButtonHandler;
//     taskClickHandler;
// }
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


export default function listScreen(props) {
    const [upcomingTasks, setUpcomingTasks] = useState(false)
    
    // returns a div that will contain the tasks for a given day, 1 = tmmr, 6 = 6 days from today
    const createTaskForUpcomingDay = (day: number) => {
        // find the date for the specified day
        let today = new Date()
        let specifiedDay = today.getDate() + day
        today.setDate(specifiedDay)
        console.log("call: " + day)
        console.log((today.getMonth() + 1) + " ")
        console.log(today.getDate() + " ")
        console.log(today.getFullYear() + " ")

        // use getTodaysTasks() to retrieve tasks for that day
        const daysTasks = props.getTodaysTasks(props.todoList, today)
        if (daysTasks.length === 0) // no tasks, return nothing
        {
            return false 
        }
        else // use array to fill out div
        {
            setUpcomingTasks(true)
            return (
                <div id="upcomingDayDiv">
                    <p id="upcomingDayP" className='text-white font-semibold'>{(today.getMonth() + 1)}/{today.getDate()}/{today.getFullYear()}</p>
                    <ul id="day" className="text-white list-none bg-[#404040] rounded-xl p-1.5">
                        <div className=''>

                        {daysTasks.map((item, index) => (
                            <li id={(item.id).toString()} key={item.id} onClick={() => props.taskClickHandler(item.id)} className="relative before:content-[''] before:inline-block before:w-3 before:h-3 before:rounded-full before:border-2 before:border-black before:bg-white before:mr-2">{item.title}</li> 
                        ))}
                        </div>
                    </ul>
                </div>
            )
        }
    }

    // returns a div that will contain all the upcoming tasks for the next 6 days
    const UpcomingTasks = () => {
        // call get tasks for the given date, plus 1 day each time

        return (
        <div className='bg-[#404040] rounded-xl p-2 w-95/100' id='mainDiv'>

            <div className='flex flex-col space-y-1 divide-y divide-gray-500 bg-[#404040] rounded-xl'>
                {createTaskForUpcomingDay(1)}    
                {createTaskForUpcomingDay(2)}    
                {createTaskForUpcomingDay(3)}    
                {createTaskForUpcomingDay(4)}    
                {createTaskForUpcomingDay(5)}    
                {createTaskForUpcomingDay(6)}  
                {createTaskForUpcomingDay(7)}    
                {
                    upcomingTasks === false && (
                    <p className="text-white">No tasks! AHHHH</p>
                    )
                }
            </div>
            
        </div>    
        )
    }
    const ListScreen = () => {
        let check = true
        console.log("begining of list: ")
        console.log(props.todoList)
        console.log(props.todoList.length)
        if (props.nextCounter === 0) { // if nextCounter is 0, then we are displaying todays tasks
            const todaysTasks = props.getTodaysTasks(props.todoList, props.date);
            console.log(todaysTasks)
            return (
                <div className="w-2/3 grid grid-cols-4 bg-[#1C1E1F] h-screen ">
                    {/* Tasks div */}
                    <div className="overflow-y-scroll col-span-3 pl-5 pt-4 pb-5 ">
                        <h1 className='text-white font-bold pb-1'>Todays Tasks</h1>
                        { todaysTasks.length > 0 ?
                        <div className='bg-[#404040] rounded-xl p-2 w-95/100'>
                            <ul id="myList" className="text-white list-none">
                                {todaysTasks.map((item, index) => (
                                    <li id={(item.id).toString()} key={item.id} onClick={() => props.taskClickHandler(item.id)} className="relative before:content-[''] before:inline-block before:w-3 before:h-3 before:rounded-full before:border-2 before:border-black before:bg-white before:mr-2">{item.title}</li> // FIXME: once database is implemented i should probably use that for the key
                                ))}
                            </ul>
                        </div>
                        :
                        <div>
                            <p className="text-white">No tasks! Yippie</p>
                        </div>
                        }
                        <h1 className='text-white font-bold pt-2'>Upcoming Tasks</h1>
                        <div className='pt-1'>
                            {UpcomingTasks()}
                        </div>
                    </div>

                    {/* Button div */}
                    <div className='flex flex-col justify-center items-center col-span-1 gap-30'>
                        {/* <button onClick={() => {props.setNextCounter(props.nextCounter + 1); props.navigateToListClick}} className="bg-[#3868A6] h-10 w-13 font-sans text-sm absolute right-3 top-3 ">next</button>   993225 */}
                        <div className=' '>
                            <button onClick={() => {props.setNextCounter(props.nextCounter + 1); props.navigateToListClick}} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm h-10.5 w-12 text-center ">Next</button>
                        </div>
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <button onClick={props.navigateToAddClick} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm h-10.5 w-20 text-center ">Add</button>
                            <button onClick={props.deleteButtonHandler} className="bg-gradient-to-l from-red-500 via-red-600 to-red-700 font-medium rounded-lg text-sm h-10.5 w-20 text-center ">Delete</button> 
                        </div>
                    </div>
                </div>          
            )  
        }
        else { // if nextCounter is not 0, then we are displaying an upcoming day
            let check = createTaskForUpcomingDay(props.nextCounter);
            let today = new Date()
            let specifiedDay = today.getDate() + props.nextCounter
            today.setDate(specifiedDay)
            console.log(document)
            return (
                <div className="flex flex-col w-2/3 bg-[#1C1E1F] h-screen justify-center items-center relative">
                    <button onClick={() => {props.setNextCounter(props.nextCounter - 1); props.navigateToListClick}} className="bg-gradient-to-l from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm h-10.5 w-12 text-center absolute left-3 top-3 ">Back</button>
                    <button onClick={() => {props.setNextCounter(props.nextCounter + 1); props.navigateToListClick}} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm h-10.5 w-12 text-center absolute right-3 top-3 ">Next</button>
                    <button onClick={props.navigateToAddClick} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm h-10.5 w-20 text-center absolute right-3 bottom-3 ">Add</button>
                    <button onClick={props.deleteButtonHandler} className="bg-gradient-to-l from-red-500 via-red-600 to-red-700 font-medium rounded-lg text-sm h-10.5 w-20 text-center absolute left-3 bottom-3 ">Delete</button>
                    {check === false ?
                    
                        <p className='text-white font-semibold'>No tasks on: {(today.getMonth() + 1)}/{today.getDate()}/{today.getFullYear()}</p>

                    :
                        check
                    }
                </div>          
            )
        }


    }

    return <ListScreen></ListScreen>
}

