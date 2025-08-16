
import { useState } from "react"; 
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../keyboard.css"

interface VirtualKeyboardProps {
    setCurrTaskName: (value: string) => void;
    setShowKeyboard: (value: boolean) => void;
    showKeyboard: boolean;

}

const VirtualKeyboard = ({setCurrTaskName, setShowKeyboard, showKeyboard}: VirtualKeyboardProps) => {
    const [layoutName, setLayoutName] = useState("default");

    const handleKeyPress = (button: string) => {
        if (button === "{shift}" || button === "{lock}") {
            setLayoutName(layoutName === "default" ? "shift" : "default");
        }
    };    
        return (
        <div
            className={`fixed bottom-0 right-0 transition-transform duration-300 ease-in-out w-full   ${
                showKeyboard ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
        >
            <Keyboard
                layout={{
                    default: [
                    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} q w e r t y u i o p [ ] \\",
                    "{lock} a s d f g h j k l ; ' {enter}",
                    "{shift} z x c v b n m , . /",
                    "{space}"
                    ],
                    shift: [
                    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                    "{tab} Q W E R T Y U I O P { } |",
                    "{lock} A S D F G H J K L : &quot; {enter}",
                    "{shift} Z X C V B N M < > ?",
                    "{space}"
                    ]
                }}
                layoutName={layoutName}
                onChange={(input) => {
                    setCurrTaskName(input);
                }}
                onKeyPress={(button) => {
                    handleKeyPress(button)
                    if (button === "{enter}") {
                        setShowKeyboard(false);
                    }
                }}
            />
        </div>
    );
}

export default VirtualKeyboard