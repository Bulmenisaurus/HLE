import { render } from 'katex';

const latexRegex = /\$(.*?)\$/;

export const isLatex = (text: string): boolean => {
    return latexRegex.test(text);
};

export const renderLatex = (text: string, container: HTMLElement) => {
    const parts = text.split(latexRegex);
    const renderedParts: (string | HTMLElement)[] = parts.map((p, i) => {
        if (i % 2 == 0) {
            // regular text node
            return p;
        } else {
            // math node
            const mathNode = document.createElement('span');

            render(p, mathNode);

            return mathNode;
        }
    });

    container.innerHTML = '';

    container.append(...renderedParts);
};
