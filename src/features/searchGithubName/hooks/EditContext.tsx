// contexts/EditModeContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

interface EditModeContextInterface {
    editMode: boolean;
    toggleEditMode: () => void;
    setEditMode: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextInterface | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
    }, []);

    return (
        <EditModeContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>
            {children}
        </EditModeContext.Provider>
    );
};

export const useEditModeContext = () => {
    const context = useContext(EditModeContext);
    if (!context) throw new Error("useEditModeContext must be used within an EditModeProvider");
    return context;
};