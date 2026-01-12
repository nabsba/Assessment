export interface ContentConfig {
    header: {
        title: string;
    };
    searchInput: {
        placeholder: string;
    };
    card: {
        checkbox: {
            text: string;
            alt: string;
        };
        avatar: {
            alt: string;
            defaultText: string;
        };
        button: {
            text: string;
        };
        noResults: string;
        selectedCount: string;
    };
    menu: {
        editModeLabel: string;
        indiceSelections: string;
        indiceSelection: string;
        selectAll: string;
    };
    mainListCard: {
        title: string;
        emptyState: string;
        startState: string;
    };
}