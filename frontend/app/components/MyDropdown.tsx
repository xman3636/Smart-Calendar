import React, { useState } from 'react';

interface MyComponentProps {
    arr: (number | string)[];
    title: string;
    setSelected: (value: string) => void; // pass in the selected setter so that the state can be changed here 
}
// MyDropdown is a react functional component that takes props in the form of MyComponentsProps
const MyDropdown = ({arr, title, setSelected}: MyComponentProps) => {
    const [selectedValue, setSelectedValue] = useState('');  
    
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
            setSelectedValue(event.target.value);
            setSelected(event.target.value)
    };
    
    return (
    <div>
        <select className='text-white border rounded w-50 h-8' value={selectedValue} onChange={handleChange}>
            {arr.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </select>
    </div>
    )
}
export default MyDropdown;