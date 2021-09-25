const clearTypewriter = (elementId) => {
    document.querySelector(`#${elementId}`).innerHTML = '';
}

const typewriter = (text, elementId, speed = 20, callback = () => {}, currentText = '', position = 0) => {

    if (currentText === '') clearTypewriter(elementId);

    if (currentText === text)
    {
        setTimeout(callback, 500);
        return;
    }

    currentText += text.charAt(position);
    position++;
    document.querySelector(`#${elementId}`).innerHTML = currentText;

    setTimeout(() => {
        typewriter(text, elementId, speed, callback, currentText, position)
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

const flashDisplay = () => {
    clearTypewriter('display-box-content');
    const flashSpeed = 80;
    showElement('display-box');
    setTimeout(() => hideElement('display-box'), flashSpeed);
    setTimeout(() => showElement('display-box'), flashSpeed * 2);
    setTimeout(() => hideElement('display-box'), flashSpeed * 3);
    setTimeout(() => showElement('display-box'), flashSpeed * 4);
}

export {typewriter, clearTypewriter, hideElement, showElement, changeDisplay, flashDisplay};
