const initIdeaSidePanel = () => {
    if (document.querySelector(".idea-side-panel-button")) {
        const ideaSidePanelButton = getElement("idea-side-panel-button");
        const ideaSidePanel = getElement("idea-side-panel");
        const newIdeaButton = getElement("new-idea-button");
        const searchIdeaButton = getElement("search-idea-button");
        const newIdeaTab = getElement("new-idea-tab");
        const searchIdeaTab = getElement("search-idea-tab");
        const newIdeaForm = getElement("new-idea-form");
        const searchIdeaForm = getElement("search-idea-form");
        const newIdeaInputTitle = getElement("new-idea-input-title");
        const newIdeaInputBody = getElement("new-idea-input-body");
        const ideaSearchInput = getElement("idea-search-input");
        const closeTabButtons = getElements("idea-close-tab-button");

        closeTabButtons.forEach(ctb => {
            addListener(ctb, "click", e => {
                newIdeaTab.classList.remove("active");
                ideaSearchTab.classList.remove("active");
            });
        });

        addListener(newIdeaForm, "submit", e => {
            e.preventDefault();
        });

        addListener(newIdeaButton, "click", e => {
            newIdeaTab.style.display = "block";
            searchIdeaTab.style.display = "none";
            newIdeaButton.classList.add("active");
            searchIdeaButton.classList.remove("active");
        });

        addListener(searchIdeaButton, "click", e => {
            newIdeaTab.style.display = "none";
            searchIdeaTab.style.display = "block";
            newIdeaButton.classList.remove("active");
            searchIdeaButton.classList.add("active");
        });

        addListener(searchIdeaForm, "submit", e => {
            e.preventDefault();
        });

        addListener(newIdeaInputTitle, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        newIdeaInputTitle.value.length > 0 &&
                        newIdeaInputBody.value.length > 0
                    ) {
                        newIdeaForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(newIdeaInputBody, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (
                        newIdeaInputTitle.value.length > 0 &&
                        newIdeaInputBody.value.length > 0
                    ) {
                        newIdeaForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(ideaSearchInput, "keyup", e => {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 13:
                    if (ideaSearchInput.value.length > 0) {
                        searchIdeaForm.submit();
                    }
                    break;

                default:
                    return;
            }
        });

        addListener(ideaSidePanelButton, "click", e => {
            ideaSidePanelButton.classList.toggle("close");
            ideaSidePanel.classList.toggle("close");
            newIdeaButton.classList.remove("active");
            searchIdeaButton.classList.remove("active");
            newIdeaTab.style.display = "none";
            searchIdeaTab.style.display = "none";
        });
    }
};
