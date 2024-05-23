import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAction } from "../../redux/slices/user/usersSlices";
import { useDispatch, useSelector } from 'react-redux';
import ErrorMsg from "../Alerts/ErrorMsg";
import LoadingComponent from "../Alerts/LoadingComponent";
import SuccessMsg from "../Alerts/SuccessMsg";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  //handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      registerAction({
        username: formData.username,
        password: formData.password,
        email:formData.email,
      })
    );
    // reset form
    setFormData({
      email: "",
      password: "",
      username: "",
    });
  };
  //store data
  const { user,error,success,loading } = useSelector(
    (state) => state?.users
  );
  //! Redirect
  useEffect(() => {
    if (user?.status==="success")
    {
      navigate("/login");
    }
  }, [user?.status]);

  return (
    <form onSubmit={handleSubmit}className="w-full lg:w-1/2">
      <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:ml-auto rounded-4xl shadow-2xl">
        <img
          className="relative -top-2 -mt-16 mb-6 h-16"
          src="flex-ui-assets/logos/flex-circle-green.svg"
          alt=""
        />
        <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
          Join our community
        </h2>
        {/* Display error */}
        {error && <ErrorMsg message={error?.message} />}
        {/* success message */}
        {success && <SuccessMsg message="Login Success" />}
        <h3 className="mb-7 text-base md:text-lg text-coolGray-500 font-medium text-center">
          Lorem ipsum dolor sit amet, consectetur adipisng.
        </h3>
        <label className="mb-4 flex flex-col w-full">
          <span className="mb-1 text-coolGray-800 font-medium">Username</span>
          <input
            className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            name="username"
          />
        </label>
        <label className="mb-4 flex flex-col w-full">
          <span className="mb-1 text-coolGray-800 font-medium">Email</span>
          <input
            className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
            placeholder="Enter your username"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label className="mb-4 flex flex-col w-full">
          <span className="mb-1 text-coolGray-800 font-medium">Password</span>
          <input
            className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
        </label>
        {loading ? (
              <LoadingComponent />
            ) : (
              <button
                className="mb-8 py-4 px-9 w-full text-white font-semibold border border-green-700 rounded-xl shadow-4xl focus:ring focus:ring-green-300 bg-green-600 hover:bg-green-700 transition ease-in-out duration-200"
                type="submit"
              >
                Get Started 
              </button>
            )}

        <p className="text-sm text-coolGray-400 font-medium text-center">
          <span>Already have an account?</span>
          <Link className="text-green-500 hover:text-green-600" to="/login">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;