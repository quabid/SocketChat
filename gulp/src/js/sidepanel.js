const initSidePanel = () => {
    if (document.querySelector(".side-panel-button")) {
        const sidePanel = document.querySelector(".side-panel");
        const signinForm = document.querySelector(".signin-form");
        const registerForm = document.querySelector(".register-form");
        const sidePanelButton = document.querySelector(".side-panel-button");
        const i1 = document.querySelector(".i1");
        const i2 = document.querySelector(".i2");
        const i3 = document.querySelector(".i3");
        const i4 = document.querySelector(".i4");
        const i5 = document.querySelector(".i5");
        const i6 = document.querySelector(".i6");
        const i7 = document.querySelector(".i7");
        const signinButton = getElement("signin-button");
        const registerButton = getElement("register-button");
        const closeTabButtons = getElements("close-tab-button");
        const signinTab = getElement("signin-tab");
        const registerTab = getElement("register-tab");

        closeTabButtons.forEach(ctb => {
            addListener(ctb, "click", e => {
                registerButton.classList.remove("active");
                signinButton.classList.remove("active");
            });
        });

        addListener(signinButton, "click", e => {
            signinTab.style.display = "block";
            registerTab.style.display = "none";
            signinButton.classList.add("active");
            registerButton.classList.remove("active");
        });

        addListener(registerButton, "click", e => {
            signinTab.style.display = "none";
            registerTab.style.display = "block";
            registerButton.classList.add("active");
            signinButton.classList.remove("active");
        });

        addListener(signinForm, "submit", e => {
            e.preventDefault();
        });

        addListener(registerForm, "submit", e => {
            e.preventDefault();
        });

        addListener(i1, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (i1.value.length > 0 && i2.value.length > 0) {
                        signinForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i2, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (i1.value.length > 0 && i2.value.length > 0) {
                        signinForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i3, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        i3.value.length > 0 &&
                        i4.value.length > 0 &&
                        i5.value.length > 0 &&
                        i6.value.length > 0 &&
                        i7.value.length > 0
                    ) {
                        registerForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i4, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        i3.value.length > 0 &&
                        i4.value.length > 0 &&
                        i5.value.length > 0 &&
                        i6.value.length > 0 &&
                        i7.value.length > 0
                    ) {
                        registerForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i5, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        i3.value.length > 0 &&
                        i4.value.length > 0 &&
                        i5.value.length > 0 &&
                        i6.value.length > 0 &&
                        i7.value.length > 0
                    ) {
                        registerForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i6, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        i3.value.length > 0 &&
                        i4.value.length > 0 &&
                        i5.value.length > 0 &&
                        i6.value.length > 0 &&
                        i7.value.length > 0
                    ) {
                        registerForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(i7, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        i3.value.length > 0 &&
                        i4.value.length > 0 &&
                        i5.value.length > 0 &&
                        i6.value.length > 0 &&
                        i7.value.length > 0
                    ) {
                        registerForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(sidePanelButton, "click", e => {
            sidePanelButton.classList.toggle("close");
            sidePanel.classList.toggle("close");
            registerButton.classList.remove("active");
            signinButton.classList.remove("active");
            signinTab.style.display = "none";
            registerTab.style.display = "none";
        });
    }
};

function disableI1(i1) {
    addAttribute(i1, "disabled", true);
}

function enableI1(i1) {
    removeAttribute(i1, "disabled");
}

function disableI2(i2) {
    addAttribute(i2, "disabled", true);
}

function enableI2(i2) {
    removeAttribute(i2, "disabled");
}
