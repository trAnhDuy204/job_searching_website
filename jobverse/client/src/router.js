import { ROUTERS } from "./utils/router";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import MasterLayout from "./pages/users/theme/masterLayout";
import EmployeeProfilePage from "pages/users/employee/employeeProfilePage";
import EmployerProfilePage from "pages/users/employer/employerProflePage";
import RegisterPage from "./pages/users/registerPage";
import LoginPage from "./pages/users/loginPage";
import EmployeeHomePage from "pages/users/employee/employeeHomePage";
import EmployerHomePage from "pages/users/employer/employerHomePage";
import EmployeeLayout from "pages/users/theme/employeeLayout";
import EmployerLayout from "pages/users/theme/employerLayout";
import PostJobFormPage from "./pages/users/employer/postJobFormPage";

const RouterCustom = ()=>{
    return (
        <Routes>
            {/*Trang đăng ký*/}
            <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />

            {/*Trang đăng nhập */}
            <Route path={ROUTERS.USER.LOGIN} element={<LoginPage/>} />
            
            {/*Trang chủ ứng viên*/}
            <Route element={<EmployeeLayout />}>
                <Route path={ROUTERS.USER.EMPLOYEE_HOMEPAGE} element={<EmployeeHomePage/>} />
                <Route path={ROUTERS.USER.EMPLOYEE_PROFILE} element={<EmployeeProfilePage/>} />
            </Route>

            {/*Trang chủ nhà tuyển dụng*/}
            <Route element={<EmployerLayout />}>
                <Route path={ROUTERS.USER.EMPLOYER_HOMEPAGE} element={<EmployerHomePage/>} />
                <Route path={ROUTERS.USER.EMPLOYER_PROFILE} element={<EmployerProfilePage/>} />
                <Route path={ROUTERS.USER.EMPLOYEE_POSTJOBFORMPAGE} element={<PostJobFormPage/>} />
            </Route>
            
            {/*Trang chủ*/}
            <Route element={<MasterLayout />}>
                <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
            </Route>

        </Routes>
    );
};

export default RouterCustom;
