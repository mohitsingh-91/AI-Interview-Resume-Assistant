import { useAuth } from "../hooks/useAuth.js";
import { Navigate } from "react-router";
import Loader from "../../../components/ui/Loader.jsx";

const Protected = ({children}) => {
    const { loading,loadingMessage,user } = useAuth();

    if (loading) {
        return (<main>
            <Loader message={loadingMessage} />
            </main>);
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children;
}

export default Protected;