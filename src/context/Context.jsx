import { createContext, useState } from "react";
import run from "../config/aiChat";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState(""); // save input data
    const [recentPrompt, setRecentPrompt] = useState("");   // display in the recent prompt 
    const [prevPrompts, setPrevPrompts] = useState([]); // store in input history
    const [showResult, setShowResult] = useState(false);    // if its true then it will hide the (default like Hello, How)  
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 10*index)
    };

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {

            setResultData("")    // We will reset our result data state
            setLoading(true)
            setShowResult(true)

        let response;
        if(prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        } 
        else {
            setPrevPrompts(prev => [...prev,input])
            setRecentPrompt(input);
            response = await run(input); // result.response.text() from aiChat stores in response
        }

        try {
            let responseArray = response.split("**");
            let newResponse = "";
            for(let i=0; i < responseArray.length; i++) 
            {
                if (i === 0 || i%2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>"+responseArray[i]+"</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("<br/>");
            let newResponseArray = newResponse2.split(" ");
            for(let i=0; i<newResponseArray.length; i++)
            {
                const nextWord = newResponseArray[i];
                delayPara(i,nextWord+" ");
            }

        } 
        catch(error) {
            console.log("Error occured:", error)
        }

        finally {
            setLoading(false); 
            setInput("");  // reset the input field for new input
        }
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        showResult,
        recentPrompt,
        resultData,
        input,
        setInput,
        loading,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider