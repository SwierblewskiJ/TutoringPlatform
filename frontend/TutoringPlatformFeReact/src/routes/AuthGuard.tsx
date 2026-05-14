import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    allowedRoles?: string[];
}

const AuthGard = ({allowedRoles } : Props) => {
    const { user, isAuthenticated } = useAuth();

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>;
    }

    if(allowedRoles && user && !allowedRoles.includes(user.role)){
        return <Navigate to="/" replace />;
    }

    return <Outlet/>

};

export default AuthGard;