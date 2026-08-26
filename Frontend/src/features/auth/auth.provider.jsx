import { useState,useEffect } from "react";
import { AuthContext} from "./auth.context";
import { getUser } from "./services/auth.api";

export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
     
    useEffect(() => {
        const getAndSetUser = async () => {
            setLoadingMessage("Loading...");
            try {
                const data = await getUser();
                setUser(data?.user ?? null);
            } catch (err) {
                console.log(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading,loadingMessage, setLoadingMessage}} >
            {children}
        </AuthContext.Provider>
    )

    
}