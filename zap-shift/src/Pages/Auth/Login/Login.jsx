import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const handleLogin = (data) => {
    console.log(data);
    signInUser(data.email, data.password)
      .then((res) => console.log(res))
      .then((error) => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <fieldset className="fieldset">
        <label className="label">Email</label>
        <input
          {...register("email", { required: true })}
          type="email"
          className="input"
          placeholder="Email"
        />
        {errors.email?.type === "required" && <p>Email is required</p>}
        <label className="label">Password</label>
        <input
          {...register("password", { required: true })}
          type="password"
          className="input"
          placeholder="Password"
        />
        {errors.password?.type === "required" && <p>Password is required</p>}
        <div>
          <a className="link link-hover">Forgot password?</a>
        </div>
        <button className="btn btn-neutral mt-4">Login</button>
      </fieldset>
    </form>
  );
};

export default Login;
