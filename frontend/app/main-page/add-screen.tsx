import react from "react"
import MyDropdown from "../components/MyDropdown"
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
    return (
        <div className="w-2/3 bg-white">               
            <div className="relative">
                <button onClick={navigateToListClick} className="bg-blue-300 rounded-4xl h-10 w-10 font-sans text-sm absolute top-1 left-1">back</button>
            </div>
            <div className="flex flex-col h-screen items-center justify-center space-y-4" >
                {/* task title and year TODO: maybe add a today option*/}
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-4">
                        <label className="text-black" >Task Title</label>
                        <label className="text-black" >Day</label>
                        <label className="text-black" >Today?</label>
                        <label className="text-black" >Repeating </label>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <input required value={currTaskName} onChange={e => setCurrTaskName(e.target.value)} type="text" id="taskName" name="taskName" className="p-2 border border-black rounded w-50 h-8 text-black" />
                        <input required value={currTaskDate} onChange={e => setCurrTaskDate(e.target.value)} type="date" id="taskDate" name="taskDate" className="p-2 border border-black rounded w-35 h-8 text-black" />
                        <input type="checkbox" checked={isTodayChecked} onChange={handleTodayCheckbox} className="size-5 accent-blue-300"></input>
                        <MyDropdown arr={monthOrWeek} title="MonthOrWeek" setSelected={setMonthlyOrWeeklyCheck}></MyDropdown>
                    </div>

                </div>
                {/* add task button */}
                <div className="flex items-center">
                    <button onClick={addTaskButtonHandler} className="bg-blue-300 rounded-2xl h-10 w-35 font-sans">Add Task</button>
                </div>
            </div>
        </div>
    ) 
}

export default AddScreen;