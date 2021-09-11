const bezierFunctionCall = (cubed, squared, linear, constant, duration, frequency, func) => {
    // Generate an array of values which represent the amount of time
}

const typewriter = (text, elementId, speed = 20, currentText = '', position = 0) => {
    if(text === '') {
        document.querySelector(`#${elementId}`).innerHTML = text;
        return;
    }
    if (currentText === text) return;

    currentText += text.charAt(position);
    position++;
    document.querySelector(`#${elementId}`).innerHTML = currentText;

    setTimeout(() => {
        typewriter(text, elementId, speed, currentText, position)
    }, speed);
}

const hideElement = (elementId) => {
    document.querySelector(`#${elementId}`).setAttribute('hidden', true);
}

const showElement = (elementId) => {
    document.querySelector(`#${elementId}`).removeAttribute('hidden');
}

const changeDisplay = (className) => {
    document.querySelector('#display-box').classList = null;
    document.querySelector('#display-box').classList.add(className);
}

export {typewriter, hideElement, showElement, changeDisplay};
