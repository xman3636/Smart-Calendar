import MyDropdown from "../components/MyDropdown"
import React, { useState } from "react";
import "react-simple-keyboard/build/css/index.css";
import "../keyboard.css"
import VirtualKeyboard from "~/components/VirtualKeyboard";


interface addScreenProps {
    navigateToListClick,
    currTaskName,
    currTaskDate,
    setCurrTaskName,
    setCurrTaskDate,
    isTodayChecked,
    handleTodayCheckbox,
    monthOrWeek,
    setMonthlyOrWeeklyCheck,
    addTaskButtonHandler
}

// Add: form to add task
const AddScreen = 
    ({navigateToListClick,
    currTaskName,
    currTaskDate,
    setCurrTaskName,
    setCurrTaskDate,
    isTodayChecked,
    handleTodayCheckbox,
    monthOrWeek,
    setMonthlyOrWeeklyCheck,
    addTaskButtonHandler}: addScreenProps) => {
    const [showKeyboard, setShowKeyboard] = useState(false)
    const [layoutName, setLayoutName] = useState("shift");
    return (
            <div className="w-2/3 bg-[#1C1E1F] h-screen">               
                <div className="flex flex-col space-y-4 h-screen items-center justify-center" >
                    <div className="grid grid-cols-2 items-center">
                        <div className="flex flex-col space-y-3">
                            <label className="text-white" >Task Title</label>
                            <label className="text-white" >Day</label>
                            <label className="text-white" >Current Day?</label>
                            <label className="text-white" >Repeating </label>
                        </div>
                        <div className="flex flex-col space-y-3">
                            {/* input field for task title */}
                            <input 
                                required value={currTaskName} 
                                onFocus={() => {
                                    setShowKeyboard(!showKeyboard)
                                }}
                                onChange={e => setCurrTaskName(e.target.value)} 
                                type="text" 
                                id="taskName" 
                                name="taskName" 
                                className="p-2 border border-white rounded w-50 h-8 text-white " 
                            />
                            <input 
                                required value={currTaskDate} 
                                onFocus={() => {
                                    setShowKeyboard(false)
                                }}
                                onChange={e => setCurrTaskDate(e.target.value)} 
                                type="date" 
                                id="taskDate" 
                                name="taskDate" 
                                className="p-2 border border-white rounded w-35 h-8 text-white" 
                            />
                            <input type="checkbox" checked={isTodayChecked} onChange={handleTodayCheckbox} className="size-5 accent-blue-300"></input>
                            <MyDropdown arr={monthOrWeek} title="MonthOrWeek" setSelected={setMonthlyOrWeeklyCheck}></MyDropdown>
                        </div>

                    </div>
                    {/* add task button */}
                    <div className="pt-1 flex gap-x-5">
                        <button onClick={navigateToListClick} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm text-white h-10.5 w-25 text-center">Back</button>
                        <button onClick={addTaskButtonHandler} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm text-white h-10.5 w-25 text-center">Add Task</button>
                    </div>
                </div>
                <VirtualKeyboard setCurrTaskName={setCurrTaskName} setShowKeyboard={setShowKeyboard} showKeyboard={showKeyboard}></VirtualKeyboard>
            </div>
    ) 
}

export default AddScreen;