import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginAction } from "../../redux/slices/user/usersSlices";
import LoadingComponent from "../Alerts/LoadingComponent";
import ErrorMsg from "../Alerts/ErrorMsg";
import SuccessMsg from "../Alerts/SuccessMsg";

const Login = () => {
  //! Nvaigation hook
  const navigate = useNavigate();
  //! Dispatch
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: "12345",
    username: "Tadikonda Ravi Teja",
  });

  //handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    //!dispatch
    dispatch(
      loginAction({
        username: formData.username,
        password: formData.password,
      })
    );
    // reset form
    setFormData({
      password: "",
      username: "",
    });
  };
  //store data
  const { userAuth, loading, error, success } = useSelector(
    (state) => state?.users
  );

  //Rediret if token expired
  useEffect(() => {
    if (error?.message === "Token expired/Invalid") {
      navigate("/login");
    }
  }, [error?.message]);

  //! Redirect
  useEffect(() => {
    if (
      userAuth?.userInfo?.token &&
      error?.message !== "Token expired/Invalid"
    ) {
      navigate("/user-profile");
    }
  }, [userAuth?.userInfo?.token]);

  return (
    <section className="py-16 xl:pb-56 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-md mx-auto">
          <h2 className="mb-4 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight">
            LOGIN 
          </h2>
          <p className="mb-12 font-medium text-lg text-gray-600 leading-normal">
            Enter your details below.
          </p>
          {/* Display error */}
          {error && <ErrorMsg message={error?.message} />}
          {/* success message */}
          {success && <SuccessMsg message="Login Success" />}
          <form onSubmit={handleSubmit}>
            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                id="signUpInput2-1"
                type="text"
                placeholder="Enter Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </label>

            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                id="signUpInput2-3"
                type="password"
                placeholder="Enter your Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            {loading ? (
              <LoadingComponent />
            ) : (
              <button
                className="mb-8 py-4 px-9 w-full text-white font-semibold border border-green-700 rounded-xl shadow-4xl focus:ring focus:ring-green-300 bg-green-600 hover:bg-green-700 transition ease-in-out duration-200"
                type="submit"
              >
                Login 
              </button>
            )}

            <p className="font-medium">
              <span className="m-2">Forgot Password?</span>
              <Link
                className="text-green-600 hover:text-green-700"
                to="/forgot-password"
              >
                Reset Password
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;