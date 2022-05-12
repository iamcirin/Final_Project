import React from "react";
import { useRef } from "react";

const WeatherForm = ({ getWeather }) => {
  const city = useRef();
  const country = useRef();
  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          getWeather(city.current.value, country.current.value, e);
          city.current.value = "";
          country.current.value = "";
        }}
      >
        <div className="row">
          <div className="col-md-3 offset-md-2">
            <input
              type="text"
              className="form-control"
              name="city"
              autoComplete="off"
              placeholder="City"
              ref={city}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="country"
              autoComplete="off"
              placeholder="Country"
              ref={country}
            />
          </div>
          <div className="col-md-3 mt-md-0 text-md-left">
            <button className="btn btn-warning">Get Weather</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WeatherForm;
