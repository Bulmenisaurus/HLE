import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { isLatex, renderLatex } from './latexrender';

export interface HLEQuestion {
    id: string;
    question: string;
    // Either a data url or empty string
    image: string;
    answer: string;
    answer_type: 'exactMatch' | 'multipleChoice';
    author_name: string;
    rationale: string;
    raw_subject: string;
    image_preview: unknown;
    // Note: this comes from the preprocessing, replacing `rationale_image.bytes`
    rationale_image_b64: string;
}

export default function Question(props: {
    question: HLEQuestion;
    onSubmit: (data: string) => void;
    index: number;
}) {
    const { question, onSubmit, index } = props;

    const questionInput = useRef<HTMLInputElement>(null);
    const questionText = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (questionText.current === null || !isLatex(questionText.current.innerText)) {
            return;
        }

        const text = questionText.current.innerText;

        renderLatex(text, questionText.current);
    }, []);

    // debugger;

    return (
        <main className='container container-question'>
            <span className='number'>Question {index + 1}/10</span>
            <span className='category'>{question.raw_subject}</span>
            <div className='content'>
                {question.image ? <img src={question.image}></img> : <span></span>}
                <p ref={questionText} id='currentQuestion' className='question'>
                    {question.question}
                </p>
            </div>
            <div className='navigation'>
                <span className='label'>
                    <label>
                        Answer: <input ref={questionInput} id='answer' type='text' />
                    </label>
                </span>

                <button
                    onClick={() => {
                        if (questionInput.current) {
                            onSubmit(questionInput.current.value);
                        }
                    }}
                >
                    Submit
                </button>
            </div>
        </main>
    );
}
