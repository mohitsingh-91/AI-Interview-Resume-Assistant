import { useContext } from "react"; 
import { AuthContext } from "../auth.context";
import { login, register, logout} from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading,loadingMessage, setLoadingMessage } = context;


    const handleLogin = async ({ email, password }) => {
        setLoadingMessage("Signing you in...");
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return {success:true};
        } catch (err) {
            console.log(err);
            return {success:false,message:err.response?.data?.message || "Login Failed"};
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoadingMessage("Creating your account...");
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return {success:true};
        } catch (err) {
            return {success:false,message:err.response?.data?.message || "Registration Failed"};
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoadingMessage("Logging out...");
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return {success:true};
        } catch (err) {
            return {success:false,message:err.response?.data?.message || "Logout Failed"};
        } finally {
            setLoading(false)
        }
    }

    

    return { user, loading,loadingMessage, handleRegister, handleLogin, handleLogout }
}