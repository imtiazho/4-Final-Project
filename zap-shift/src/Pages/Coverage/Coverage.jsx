import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const position = [23.685, 90.3563];
  const mapRef = useRef(null);
  const handleSearch = (e) => {
    e.preventDefault();
    const loc = e.target.location.value;
    const district = serviceCenters.find((c) =>
      c.district.toLowerCase().includes(loc),
    );
    if (district) {
      const coordinate = [district.latitude, district.longitude];
      console.log(coordinate);
      mapRef.current.flyTo(coordinate, 14);
    }
  };

  return (
    <div>
      Coverage
      <div>
        <form onSubmit={handleSearch}>
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              name="location"
              type="search"
              className="grow"
              placeholder="Search"
            />
          </label>
        </form>
      </div>
      <div className="border w-[90%] mx-auto h-200">
        <MapContainer
          ref={mapRef}
          className="h-200"
          center={position}
          zoom={8}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {serviceCenters.map((center) => (
            <>
              <Marker position={[center.latitude, center.longitude]}>
                <Popup>{center.district}</Popup>
              </Marker>
            </>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
