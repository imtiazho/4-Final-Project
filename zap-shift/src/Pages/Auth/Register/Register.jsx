import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Register = () => {
  const { googleSignIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

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
          const photoURL = res.data.data.url;

          // Create User in the database
          const userInfo = {
            email: data.email,
            displayName: data.name,
            photoURL: photoURL,
          };
          axiosSecure.post("/users", userInfo).then((res) => {
            if (res.data.insertedId) {
              console.log("User inserted in the Database");
            }
          });

          const userProfile = {
            photoURL: photoURL,
            displayName: data.name,
          };

          // Update User to firebase
          updateUser(userProfile)
            .then(() => {
              console.log("User profile updated with current user");
              navigate(location.state || "/");
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSocialLogin = () => {
    googleSignIn().then((res) => {
      console.log(res);
      const loggedInUser = res.user;

      // Create User in the database
      const userInfo = {
        email: loggedInUser.email,
        displayName: loggedInUser.displayName,
        photoURL: loggedInUser.photoURL,
      };
      if (loggedInUser) {
        axiosSecure.post("/users", userInfo).then((res) => {
          if (res.data.insertedId) {
            console.log("User inserted in the Database");
          }
        });
      }
    });
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
      <button
        onClick={handleSocialLogin}
        className="btn bg-white text-black border-[#e5e5e5]"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default Register;
