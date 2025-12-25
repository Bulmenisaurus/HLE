import { h } from 'preact';
export default function EndScreen(props: { correct: number }) {
    const { correct } = props;
    return (
        <main className='container container-final'>
            <div className='content'>
                {correct > 3 ? (
                    <h1>You are smarter than a frontier LLM!</h1>
                ) : (
                    <h1>You are just a human after all...</h1>
                )}
                <p>
                    Final score: {correct} / 10. The current highest scoring LLM (as of December
                    2025), would be expected to get around 3 / 10 correct.
                </p>
                {correct > 3 ? (
                    <figure>
                        <img
                            src='./images/robot-defeat.jpg'
                            alt="Replicant Roy Batty's final moments in Blade runner"
                        ></img>
                        <figcaption>
                            <em>Time to die, robot.</em>
                        </figcaption>
                    </figure>
                ) : (
                    <figure>
                        <img src='./images/human-defeat.jpg' alt='HAL-9000' />
                        <figcaption>
                            <em>Everything is going extremely well.</em>
                        </figcaption>
                    </figure>
                )}
            </div>
        </main>
    );
}
