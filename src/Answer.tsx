import { h } from 'preact';
import { HLEQuestion } from './Question';
import { useRef, useEffect } from 'preact/hooks';
import { isLatex, renderLatex } from './latexrender';

// This is necessary because the HLE dataset file itself helpfully provides data urls for the Question images (in the `image` column)
// However, there is no such column for the rationale, which also has images associated.
// To avoid reading the image bytes, inferring a mime type and creating a correct data url, we just create a blob from the image data and pass that in.
const renderImageBytes = (bytes: string): string => {
    let dataArray: Uint8Array<ArrayBuffer>;
    try {
        // @ts-ignore
        dataArray = Uint8Array.fromBase64(bytes);
    } catch {
        dataArray = Uint8Array.from(bytes, (c: string) => c.charCodeAt(0));
    }

    const blob = new Blob([dataArray]);
    const src = URL.createObjectURL(blob);

    return src;
};

export default function Answer(props: {
    question: HLEQuestion;
    onSubmit: () => void;
    index: number;
    correct: boolean;
}) {
    const { question, onSubmit, index, correct } = props;

    const answerText = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (answerText.current === null || !isLatex(answerText.current.innerText)) {
            return;
        }

        const text = answerText.current.innerText;

        renderLatex(text, answerText.current);
    }, []);

    return (
        <main className='container container-answer'>
            <span className='number'>Question {index + 1}/10</span>
            <span className='category'>{question.raw_subject}</span>
            <div className='content'>
                {question['rationale_image_b64'] ? (
                    <img src={renderImageBytes(question['rationale_image_b64'])}></img>
                ) : null}

                {correct ? (
                    <h1 className={'result result-correct'}>Correct</h1>
                ) : (
                    <h1 className={'result result-incorrect'}>Incorrect</h1>
                )}
                <p ref={answerText} className='question'>
                    <br />
                    Correct answer: {question.answer}
                    <br />
                    {question.rationale}
                </p>
            </div>
            <div className='navigation'>
                <button onClick={() => onSubmit()}>Next</button>
            </div>
        </main>
    );
}
