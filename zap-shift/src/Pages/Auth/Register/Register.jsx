import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser } = useAuth();
  const handleRegistration = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === "required" && <p>Email Required</p>}

          <label className="label">Password</label>
          <input
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && <p>Password Required</p>}
          {/* {errors.password?.type === "pattern" && <p>Password must have lowercase...</p>}  you can use regex for password */}
          {errors.password?.type === "minLength" && (
            <p>Password must be 6 Character</p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
