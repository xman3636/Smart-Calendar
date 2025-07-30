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
                <div>
                    <p className='text-black font-semibold'>{(today.getMonth() + 1)}/{today.getDate()}/{today.getFullYear()}</p>
                    <ul id="day" className="text-black list-none">
                        {daysTasks.map((item, index) => (
                            <li id={(item.id).toString()} key={item.id} onClick={() => props.taskClickHandler(item.id)} className="relative before:content-[''] before:inline-block before:w-3 before:h-3 before:rounded-full before:border-2 before:border-black before:bg-white before:mr-2">{item.title + " and id: " + item.id}</li> // FIXME: once database is implemented i should probably use that for the key
                        ))}
                    </ul>
                </div>
            )
        }
    }

    // returns a div that will contain all the upcoming tasks for the next 6 days
    const UpcomingTasks = () => {
        // call get tasks for the given date, plus 1 day each time

        return (
        <div id='mainDiv'>
            
            {createTaskForUpcomingDay(1)}    
            {createTaskForUpcomingDay(2)}    
            {createTaskForUpcomingDay(3)}    
            {createTaskForUpcomingDay(4)}    
            {createTaskForUpcomingDay(5)}    
            {createTaskForUpcomingDay(6)}  
            {createTaskForUpcomingDay(7)}    
            {
                upcomingTasks === false && (
                <p className="text-black">No tasks! AHHHH</p>
                )
            }
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
                <div className="flex flex-col w-2/3 bg-white h-screen justify-center items-center relative">
                    <button onClick={() => {props.setNextCounter(props.nextCounter + 1); props.navigateToListClick}} className="bg-blue-300 h-10 w-13 font-sans text-sm absolute right-3 top-3 ">next</button>
                    <button onClick={props.navigateToAddClick} className="bg-blue-300 rounded-full h-17 w-17 font-sans text-sm absolute right-3 bottom-3 ">add</button>
                    <button onClick={props.deleteButtonHandler} className="bg-red-300 rounded-full h-17 w-17 font-sans text-sm absolute left-3 bottom-3 ">delete</button>
                    { /* I AM MAKING A BOLD ASSUMPTION, that days and months can be single digits. so take january for example, it will be represented as 1, not 01*/ }
                    <div className="w-5/8 h-6/8 overflow-y-scroll  justify-center absolute top-4">
                        <h1 className='text-black font-bold'>Todays Tasks</h1>
                        { todaysTasks.length > 0 ?
                        <div>
                            <ul id="myList" className="text-black list-none">
                                {todaysTasks.map((item, index) => (
                                    <li id={(item.id).toString()} key={item.id} onClick={() => props.taskClickHandler(item.id)} className="relative before:content-[''] before:inline-block before:w-3 before:h-3 before:rounded-full before:border-2 before:border-black before:bg-white before:mr-2">{item.title + " and id: " + item.id}</li> // FIXME: once database is implemented i should probably use that for the key
                                ))}
                            </ul>
                        </div>
                        :
                        <div>
                            <p className="text-black">No tasks! Yippie</p>
                        </div>
                        }
                        <h1 className='text-black font-bold pt-2'>Upcoming Tasks</h1>
                        {UpcomingTasks()}
                    </div>
                </div>          
            )  
        }
        else { // if nextCounter is not 0, then we are displaying an upcoming day
            let check = createTaskForUpcomingDay(props.nextCounter);
            let today = new Date()
            let specifiedDay = today.getDate() + props.nextCounter
            today.setDate(specifiedDay)
            return (
                <div className="flex flex-col w-2/3 bg-white h-screen justify-center items-center relative">
                    <button onClick={() => {props.setNextCounter(props.nextCounter + 1); props.navigateToListClick}} className="bg-blue-300 h-10 w-13 font-sans text-sm absolute right-3 top-3 ">next</button>
                    <button onClick={() => {props.setNextCounter(props.nextCounter - 1); props.navigateToListClick}} className="bg-blue-300 h-10 w-13 font-sans text-sm absolute left-3 top-3 ">back</button>
                    <button onClick={props.navigateToAddClick} className="bg-blue-300 rounded-full h-17 w-17 font-sans text-sm absolute right-3 bottom-3 ">add</button>
                    <button onClick={props.deleteButtonHandler} className="bg-red-300 rounded-full h-17 w-17 font-sans text-sm absolute left-3 bottom-3 ">delete</button>
                    {check === false ?
                    
                        <p className='text-black font-semibold'>No tasks on: {(today.getMonth() + 1)}/{today.getDate()}/{today.getFullYear()}</p>

                    :
                        check
                    }
                </div>          
            )
        }


    }

    return <ListScreen></ListScreen>
}

