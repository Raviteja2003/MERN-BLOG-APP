import {BrowserRouter,Routes,Route} from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Users/Login";
import UserProfile from "./components/Users/UserProfile";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/AuthRoute/ProtectedRoute";

export default function App() {
  //!Get the login user from store
  const {userAuth} = useSelector((state)=>state?.users);
  const isLogin = userAuth?.userInfo?.token;
  return (
    <BrowserRouter>
      {isLogin ? <PrivateNavbar/>:<PublicNavbar/>};
      <Routes>
        <Route path="" element={<Homepage/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/user-profile" element={<ProtectedRoute>
          <UserProfile/>
        </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
  )
}