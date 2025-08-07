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
        <div className="w-2/3 bg-[#1C1E1F]">               
            <div className="relative">
                <button onClick={navigateToListClick} className="bg-gradient-to-l from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm text-white h-10.5 w-12 text-center absolute left-3 top-3 ">Back</button>
            </div>
            <div className="flex flex-col h-screen items-center justify-center space-y-4" >
                {/* task title and year TODO: maybe add a today option*/}
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-4">
                        <label className="text-white" >Task Title</label>
                        <label className="text-white" >Day</label>
                        <label className="text-white" >Current Day?</label>
                        <label className="text-white" >Repeating </label>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <input required value={currTaskName} onChange={e => setCurrTaskName(e.target.value)} type="text" id="taskName" name="taskName" className="p-2 border border-white rounded w-50 h-8 text-white " />
                        <input required value={currTaskDate} onChange={e => setCurrTaskDate(e.target.value)} type="date" id="taskDate" name="taskDate" className="p-2 border border-white rounded w-35 h-8 text-white" />
                        <input type="checkbox" checked={isTodayChecked} onChange={handleTodayCheckbox} className="size-5 accent-blue-300"></input>
                        <MyDropdown arr={monthOrWeek} title="MonthOrWeek" setSelected={setMonthlyOrWeeklyCheck}></MyDropdown>
                    </div>

                </div>
                {/* add task button */}
                <div className="flex items-center">
                    <button onClick={addTaskButtonHandler} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm text-white h-10.5 w-25 text-center">Add Task</button>
                </div>
            </div>
        </div>
    ) 
}

export default AddScreen;