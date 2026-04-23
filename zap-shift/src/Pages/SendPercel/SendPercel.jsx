import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const SendPercel = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    // formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenter = useLoaderData();
  const regionsDuplicate = serviceCenter.map((s) => s.region);
  const regions = [...new Set(regionsDuplicate)];
  //   const senderRegion = watch("senderRegion");
  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });

  const districtsByRegion = (region) => {
    const regionDistrict = serviceCenter.filter((c) => c.region === region);
    const districts = regionDistrict.map((d) => d.district);
    return districts;
  };

  const handleSendParcel = (data) => {
    console.log(data);
    const isDocument = data.parcelType === "document";
    const sameDistrict = data.senderDistrict === data.receiverDistrict;
    const parcelWeight = parseFloat(data.parcelWeight);
    let cost = 0;
    if (isDocument) {
      cost = sameDistrict ? 60 : 80;
    } else {
      if (parcelWeight < 3) {
        cost = sameDistrict ? 110 : 150;
      } else {
        const minCharge = sameDistrict ? 110 : 150;
        const extraWeight = parcelWeight - 3;
        const extraCharge = sameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;
        cost = minCharge + extraCharge;
      }
    }

    Swal.fire({
      title: "Are you agree with the cost?",
      text: `You will be charged ${cost} Taka`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed)
        // Send it to database via server
        axiosSecure.post("/parcels", data).then((res) => {
          if (res.data.acknowledged) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-sm p-12">
        {/* Title Section */}
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">
          Send A Parcel
        </h1>

        <div className="space-y-6">
          <form onSubmit={handleSubmit(handleSendParcel)}>
            <section>
              <h2 className="text-xl font-semibold text-emerald-900 mb-4">
                Enter your parcel details
              </h2>
              <hr className="mb-6 border-gray-100" />

              {/* Radio Options */}
              <div className="flex gap-8 mb-8">
                <label className="flex items-center gap-2 cursor-pointer opacity-60">
                  <input
                    type="radio"
                    value="document"
                    defaultChecked
                    {...register("parcelType")}
                    className="radio radio-sm"
                  />
                  <span className="text-sm font-medium text-emerald-900">
                    Document
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer opacity-60">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("parcelType")}
                    className="radio radio-sm"
                  />
                  <span className="text-sm font-medium text-emerald-900">
                    Not-Document
                  </span>
                </label>
              </div>

              {/* Parcel Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-emerald-900">
                      Parcel Name
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("parcelName")}
                    placeholder="Parcel Name"
                    className="input input-bordered w-full bg-white border-gray-200"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-emerald-900">
                      Parcel Weight (KG)
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("parcelWeight")}
                    placeholder="Parcel Weight (KG)"
                    className="input input-bordered w-full bg-white border-gray-200"
                  />
                </div>
              </div>
            </section>

            {/* Sender and Receiver Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              {/* Sender Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-emerald-900 text-lg">
                  Sender Details
                </h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Sender Name
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("senderName")}
                    placeholder="Sender Name"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Sender Email
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("senderEmail")}
                    placeholder="Sender Email"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Address</span>
                  </label>
                  <input
                    type="text"
                    {...register("senderAddress")}
                    placeholder="Address"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Sender Phone No
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("senderPhone")}
                    placeholder="Sender Phone No"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>

                {/* Sender region */}
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Region</legend>
                  <select
                    {...register("senderRegion")}
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
                    <span className="label-text font-semibold">
                      Your District
                    </span>
                  </label>
                  <select
                    {...register("senderDistrict")}
                    className="select select-bordered bg-white border-gray-200 font-normal text-gray-400"
                  >
                    <option disabled={true}>Select your District</option>
                    {districtsByRegion(senderRegion).map((r, i) => (
                      <option value={r} key={i}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Pickup Instruction
                    </span>
                  </label>
                  <textarea
                    {...register("pickUpInstruct")}
                    className="textarea textarea-bordered h-32 bg-white border-gray-200"
                    placeholder="Pickup Instruction"
                  ></textarea>
                </div>
              </div>

              {/* Receiver Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-emerald-900 text-lg">
                  Receiver Details
                </h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver Name
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("receiverName")}
                    placeholder="Receiver Name"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver Email
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("receiverEmail")}
                    placeholder="Receiver Email"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver Address
                    </span>
                  </label>
                  <input
                    {...register("receiverAddress")}
                    type="text"
                    placeholder="Address"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver Contact No
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register("receiverPhone")}
                    placeholder="Sender Contact No"
                    className="input input-bordered bg-white border-gray-200"
                  />
                </div>

                {/* Reci reg */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver Region
                    </span>
                  </label>
                  <select
                    {...register("receiverRegion")}
                    className="select select-bordered bg-white border-gray-200 font-normal text-gray-400"
                  >
                    <option disabled={true}>Select your Region</option>
                    {regions.map((r, i) => (
                      <option value={r} key={i}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Receiver District
                    </span>
                  </label>
                  <select
                    {...register("receiverDistrict")}
                    className="select select-bordered bg-white border-gray-200 font-normal text-gray-400"
                  >
                    <option disabled={true}>Select your District</option>
                    {districtsByRegion(receiverRegion).map((r, i) => (
                      <option value={r} key={i}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Delivery Instruction
                    </span>
                  </label>
                  <textarea
                    {...register("deliveryInstruct")}
                    className="textarea textarea-bordered h-32 bg-white border-gray-200"
                    placeholder="Delivery Instruction"
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Footer Section */}
            <div className="pt-8">
              <p className="text-sm text-gray-600 mb-6 font-medium">
                * PickUp Time 4pm-7pm Approx.
              </p>
              <input
                type="SUBMIT"
                value="Proceed to Confirm Booking"
                className="btn border-none bg-[#c5e76d] hover:bg-[#b3d655] text-emerald-900 normal-case px-10 rounded-lg"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendPercel;
