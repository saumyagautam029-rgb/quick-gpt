import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://quick-gpt-backend-1.onrender.com";

    const value = {
        user,
        setUser,
        backendUrl
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
