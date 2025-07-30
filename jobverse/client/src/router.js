import { ROUTERS } from "./utils/router";
import HomePage from "./pages/users/homePage";
import { Routes, Route } from "react-router-dom";
import MasterLayout from "./pages/users/theme/masterLayout";
import EmployeeProfilePage from "pages/users/employee/employeeProfilePage";
import EmployerProfilePage from "pages/users/employer/employerProflePage";
import RegisterPage from "./pages/users/registerPage";
import LoginPage from "./pages/users/loginPage";

const RouterCustom = ()=>{
    return (
        <Routes>
            <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTERS.USER.LOGIN} element={<LoginPage/>} />

            <Route element={<MasterLayout />}>
                <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
                <Route path={ROUTERS.USER.EMPLOYEE_PROFILE} element={<EmployeeProfilePage />} />
                <Route path={ROUTERS.USER.EMPLOYER_PROFILE} element={<EmployerProfilePage />} />
            </Route>
        </Routes>
    );
};

export default RouterCustom;
