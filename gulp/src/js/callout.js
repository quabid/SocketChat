if (getElement("close-button")) {
    const closeButton = getElement("close-button");
    addListener(closeButton, "click", e => {
        closeButton.parentNode.classList.add("close");
    });
}
