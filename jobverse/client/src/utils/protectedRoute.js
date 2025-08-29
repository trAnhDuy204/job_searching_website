import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userKey = `user_${role}`;
  const user = JSON.parse(localStorage.getItem(userKey));

  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
