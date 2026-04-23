import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUser } = useAuth();
  const handleRegistration = (data) => {
    const profileImage = data.photo[0];

    createUser(data.email, data.password)
      .then((res) => {
        console.log(res);

        // Store the image and get the photo url
        const formData = new FormData();
        formData.append("image", profileImage);

        // Send the photo to store and get the photo
        const imageAPIUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;
        axios.post(imageAPIUrl, formData).then((res) => {
          const userProfile = {
            photoURL: res.data.data.url,
            displayName: data.name,
          };

          // Update User to firebase
          updateUser(userProfile)
            .then(() => {
              console.log("User profile updated with current user");
              navigate(location.state || '/')
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">
          {/* Image */}
          <label className="label">Photo</label>
          <input
            type="file"
            {...register("photo", { required: true })}
            className="file-input"
            placeholder="Photo"
          />
          {errors.name?.type === "required" && <p>Name Required</p>}

          {/* Name */}
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input"
            placeholder="Name"
          />
          {errors.name?.type === "required" && <p>Name Required</p>}

          {/* email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === "required" && <p>Email Required</p>}

          {/* Password */}
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
