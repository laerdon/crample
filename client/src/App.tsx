import { useState } from 'react'
import './App.css'
import './output.css';

import { NextUIProvider } from "@nextui-org/react"
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Slider } from '@nextui-org/react';
import ReactMarkdown from 'react-markdown'


function App() {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState(2);
    const [apiResponse, setApiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        const userInput = `${input1}; ${input2}; ${input3} hours`;
        console.log('Making API call with:', userInput);
        
        setIsLoading(true);
        try {
        const response = await fetch('http://localhost:3000/dirty-shortcut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000/dirty-shortcut"
            },
            body: JSON.stringify({userInput}),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        setApiResponse(data);
        console.log(apiResponse)
        } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const processApiResponse = (apiResponse: string) => {
        // Remove outer quotes if present
        let processed = apiResponse.replace(/^"|"$/g, '');
        // Replace "\n" literals with actual line breaks
        processed = processed.replace(/\\n/g, '\n');
        return processed;
    };

    return (
        <>
        <NextUIProvider>
        <div>
            <section className={'mb-10 inline-block'}>
                <h1 className="text-3xl mb-10">crample</h1>
                <div>
                    <Input
                        className="mb-5"
                        label="What is your exam on?"
                        onChange={(e) => setInput1(e.target.value)}
                    />
                    <Input
                        className="mb-5"
                        label="When is your exam?"
                        onChange={(e) => setInput2(e.target.value)}
                    />
                    <Slider
                        className="mb-5"
                        showSteps={true}
                        maxValue={10}
                        minValue={0}
                        step={1}
                        defaultValue={2}
                        label="How many hours will you study per day?"
                        onChange={(e) => setInput3(Number(e.valueOf()))}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </section>
            <section>
                <ReactMarkdown className="markdown">{processApiResponse(apiResponse)}</ReactMarkdown>
            </section>
        </div>
        </NextUIProvider>
        </>
    )
}

export default App
