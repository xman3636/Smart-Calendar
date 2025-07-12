import React from 'react'

interface listProps {
    getTodaysTasks;
    todoList: Task[];
    date;
    navigateToAddClick;
    deleteButtonHandler;
    taskClickHandler;
}
const TestFunc = () => {
    return (
        <div className="flex w-2/3 bg-white h-screen justify-center items-center relative">
            <p className="text-black">No tasks! Yippie</p>
        </div>    
    )
}
const ListScreen = ({getTodaysTasks, todoList, date, navigateToAddClick, deleteButtonHandler, taskClickHandler}: listProps) => {
    console.log("begining of list: ")
    console.log(todoList)
    console.log(todoList.length)
    const todaysTasks = getTodaysTasks(todoList, date);
    console.log(todaysTasks)
    return (
        <div className="flex w-2/3 bg-white h-screen justify-center items-center relative">
            <button onClick={navigateToAddClick} className="bg-blue-300 rounded-full h-17 w-17 font-sans text-sm absolute right-3 bottom-3 ">add</button>
            <button onClick={deleteButtonHandler} className="bg-red-300 rounded-full h-17 w-17 font-sans text-sm absolute left-3 bottom-3 ">delete</button>
            { /* I AM MAKING A BOLD ASSUMPTION, that days and months can be single digits. so take january for example, it will be represented as 1, not 01*/ }
            { todaysTasks.length > 0 ?
            <ul id="myList" className="text-black list-none">
                {todaysTasks.map((item, index) => (
                    <li id={(item.id).toString()} key={item.id} onClick={() => taskClickHandler(item.id)} className="relative before:content-[''] before:inline-block before:w-3 before:h-3 before:rounded-full before:border-2 before:border-black before:bg-white before:mr-2">{item.title + " and id: " + item.id}</li> // FIXME: once database is implemented i should probably use that for the key
                ))}
            </ul>
            :
            <p className="text-black">No tasks! Yippie</p>
            }
        </div>          
    )
}
export default ListScreen