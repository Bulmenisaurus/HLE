import Papa from 'papaparse';
import { h, render, createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Question, { HLEQuestion } from './Question';
import Answer from './Answer';
import Final from './Final';

const getData = async (): Promise<HLEQuestion[]> => {
    const req = await fetch('./random-sample.csv');
    const res = await req.text();
    const p = Papa.parse(res, { delimiter: ',', header: true });
    return p.data as HLEQuestion[];
};

interface AppData {
    questions: HLEQuestion[];
    cumulativeCorrect: number;
}

type AppState =
    | { type: 'loading' }
    | { type: 'question'; questionIdx: number; data: AppData }
    | { type: 'answer'; questionIdx: number; userCorrect: boolean; data: AppData }
    | { type: 'final'; data: AppData };

const normalize = (answer: string) => answer.replace(/ /g, '').toLowerCase();

const checkAnswer = (question: HLEQuestion, answer: string) => {
    return normalize(question.answer) === normalize(answer);
};

export default function AppContent() {
    const [appState, setState] = useState<AppState>({ type: 'loading' });

    useEffect(() => {
        getData().then((d) => {
            setState({
                type: 'question',
                questionIdx: 0,
                data: { questions: d, cumulativeCorrect: 0 },
            });
        });
    }, []);

    switch (appState.type) {
        case 'loading':
            return <div>Loading</div>;
        case 'question':
            return (
                <Question
                    index={appState.questionIdx}
                    question={appState.data.questions[appState.questionIdx]}
                    onSubmit={(a) => {
                        const question = appState.data.questions[appState.questionIdx];
                        const res = checkAnswer(question, a);
                        setState({
                            type: 'answer',
                            questionIdx: appState.questionIdx,
                            userCorrect: checkAnswer(question, a),
                            data: {
                                ...appState.data,
                                cumulativeCorrect: appState.data.cumulativeCorrect + Number(res),
                            },
                        });
                    }}
                />
            );
        case 'answer':
            return (
                <Answer
                    index={appState.questionIdx}
                    question={appState.data.questions[appState.questionIdx]}
                    correct={appState.userCorrect}
                    onSubmit={() => {
                        if (appState.questionIdx === 9) {
                            setState({
                                type: 'final',
                                data: appState.data,
                            });
                        } else {
                            setState({
                                type: 'question',
                                questionIdx: appState.questionIdx + 1,
                                data: appState.data,
                            });
                        }
                    }}
                />
            );
        case 'final':
            return <Final correct={appState.data.cumulativeCorrect} />;
        default:
            return <div>Unknown state</div>;
    }
}
