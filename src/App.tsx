import React, { useState } from 'react';

const App: React.FC = () => {
    const [bookName, setBookName] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // handle input change
    const handleBookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookName(e.target.value);
    };

    // Example posting a text URL:
    async function generateAnswer() {
        const formdata = new FormData();
        formdata.append("key", "8f9aa6942d41f6d9fc2df93c749c8fe0");
        formdata.append("txt", bookName);
        formdata.append("lang", "en");  // 2-letter code, like en es fr ...

        try {
            const response = await fetch("https://api.meaningcloud.com/sentiment-2.1", {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data);
            } else {
                setError(`Error: ${data.status.msg}`);
            }
        } catch (error: any) {
            setError(`Error: ${error.message}`);
        }
    }

    const getFriendlyMessage = (scoreTag: string): string => {
        switch (scoreTag) {
            case 'P+':
                return 'Very Positive';
            case 'P':
                return 'Positive';
            case 'N+':
                return 'Very Negative';
            case 'N':
                return 'Negative';
            default:
                return 'Neutral';
        }
    };
    

    return (
        <>
            <h1>Sentiment Analysis</h1>
            <label htmlFor="book-name">Enter the text: </label>
            <input type="text" name='book-name' onChange={handleBookNameChange} value={bookName} />
            <button onClick={generateAnswer}>Analyze</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div>
                    <h2>Analysis Result</h2>
                    <p><strong>Agreement:</strong> {result.agreement}</p>
                    <p><strong>Confidence:</strong> {result.confidence}</p>
                    <p><strong>Irony:</strong> {result.irony}</p>
                    <p><strong>Subjectivity:</strong> {result.subjectivity}</p>
                    <h3>Sentences</h3>
                    {result.sentence_list.map((sentence: any, index: number) => (
                        <div key={index}>
                            <p><strong>Text:</strong> {sentence.text}</p>
                            <p><strong>Score Tag:</strong>  {getFriendlyMessage(sentence.score_tag)}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default App;