import React from "react";
import { useForm, useWatch } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import { useLoaderData, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Rider = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    // formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const serviceCenter = useLoaderData();
  const regionsDuplicate = serviceCenter.map((s) => s.region);
  const regions = [...new Set(regionsDuplicate)];

  const riderRegion = useWatch({ control, name: "Region" });

  const districtsByRegion = (region) => {
    const regionDistrict = serviceCenter.filter((c) => c.region === region);
    const districts = regionDistrict.map((d) => d.district);
    return districts;
  };

  const handleBeARider = (data) => {
    axiosSecure.post("/riders", data).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="w-[80%] mx-auto">
      <form onSubmit={handleSubmit(handleBeARider)}>
        {/* Sender and Receiver Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          {/* Sender Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-900 text-lg">
              Rider Details
            </h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <input
                type="text"
                {...register("Name")}
                placeholder="Name"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="text"
                {...register("Email")}
                placeholder="Email"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Address</span>
              </label>
              <input
                type="text"
                {...register("Address")}
                placeholder="Address"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone No</span>
              </label>
              <input
                type="text"
                {...register("Phone")}
                placeholder="Phone No"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            {/* Sender region */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Region</legend>
              <select
                {...register("Region")}
                defaultValue="Pick a Region"
                className="select"
              >
                <option disabled={true}>Pick a Region</option>
                {regions.map((r, i) => (
                  <option value={r} key={i}>
                    {r}
                  </option>
                ))}
              </select>
              <span className="label">Optional</span>
            </fieldset>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Your District</span>
              </label>
              <select
                {...register("District")}
                className="select select-bordered bg-white border-gray-200 font-normal text-gray-400"
              >
                <option disabled={true}>Select your District</option>
                {districtsByRegion(riderRegion).map((r, i) => (
                  <option value={r} key={i}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Driving License
                </span>
              </label>
              <input
                type="text"
                {...register("drivingLicense")}
                placeholder="Driving License"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">NID</span>
              </label>
              <input
                type="text"
                {...register("NID")}
                placeholder="NID"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Bike</span>
              </label>
              <input
                type="text"
                {...register("BikeRegistration")}
                placeholder="Bike Registration"
                className="input input-bordered bg-white border-gray-200"
              />
            </div>

            <input
              type="submit"
              value="SUBMIT"
              className="btn border-none bg-[#c5e76d] hover:bg-[#b3d655] text-emerald-900 normal-case px-10 rounded-lg"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Rider;
