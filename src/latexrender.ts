import { render } from 'katex';

const latexRegex = /((?:\$.*?\$)|(?:\\\[.*?\\\]))/s;

export const isLatex = (text: string): boolean => {
    console.log(text);
    return latexRegex.test(text);
};

export const renderLatexWithDelimeter = (text: string, element: HTMLElement) => {
    let inlineDollarSign = text.match(/^\$(.*)\$$/);
    if (inlineDollarSign) {
        render(inlineDollarSign[1], element, { displayMode: false });
        return;
    }

    let bracketNotation = text.match(/^\\\[(.*)\\\]$/s);
    if (bracketNotation) {
        render(bracketNotation[1], element, { displayMode: true });
        return;
    }

    console.error('Not supposed to be here');
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
            renderLatexWithDelimeter(p, mathNode);

            return mathNode;
        }
    });

    container.innerHTML = '';

    container.append(...renderedParts);
};
