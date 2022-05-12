import React from "react";
import "./weather.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { WiDaySunny } from "react-icons/wi";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { BsCloudDrizzle, BsCloudRain, BsFillCloudsFill } from "react-icons/bs";
import { RiThunderstormsLine } from "react-icons/ri";
import { FaRegSnowflake } from "react-icons/fa";
import { WiDayFog } from "react-icons/wi";
import { MdOutlineWbSunny } from "react-icons/md";
import WeatherForm from "./WeatherForm";
import { Link } from "react-router-dom";

//https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}

const key = "dae27adf4f1e7b3a9016039a3b22a83e";

const Weather = () => {
  const [current, setCurrent] = useState({
    city: undefined,
    country: undefined,
    icon: "",
    main: undefined,
    celsius: undefined,
    temp_max: undefined,
    temp_min: undefined,
    description: "",
    error: false,
    number: undefined,
  });
  const [weatherIcon, setWeatherIcon] = useState({
    ThunderStorm: <RiThunderstormsLine className="display-1" />,
    Drizzle: <BsCloudDrizzle className="display-1" />,
    Rain: <BsCloudRain className="display-1" />,
    Snow: <FaRegSnowflake className="display-1" />,
    Atmosphere: <WiDayFog className="display-1" />,
    Clear: <MdOutlineWbSunny className="display-1" />,
    Clouds: <BsFillCloudsFill className="display-1" />,
  });
  const getWeatherIcon = (rangeId) => {
    if (rangeId >= 200 && rangeId <= 232) {
      return weatherIcon.ThunderStorm;
    }
    if (rangeId >= 300 && rangeId <= 321) {
      return weatherIcon.Drizzle;
    }
    if (rangeId >= 500 && rangeId <= 531) {
      return weatherIcon.Rain;
    }
    if (rangeId >= 600 && rangeId <= 622) {
      return weatherIcon.Snow;
    }
    if (rangeId >= 701 && rangeId <= 781) {
      return weatherIcon.Atmosphere;
    }
    if (rangeId === 800) {
      return weatherIcon.Clear;
    }
    if (rangeId >= 801 && rangeId <= 804) {
      return weatherIcon.Clouds;
    }
  };

  const getWeather = async (citee, countree, e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${citee},${countree}&appid=${key}`
      );
      const calCelcius = (temp) => {
        let cell = Math.floor(temp - 273.15);
        return cell;
      };
      setCurrent({
        city: res.data.name,
        country: res.data.sys.country,
        celsius: calCelcius(res.data.main.temp),
        temp_max: calCelcius(res.data.main.temp_max),
        temp_min: calCelcius(res.data.main.temp_min),
        description: res.data.weather[0].description,
        icon: getWeatherIcon(res.data.weather[0].id),
      });
    } catch (error) {
      setCurrent({
        ...current,
        error: "Put a valid city and country please! ",
      });
    }
  };

  return (
    <div className="mainContainer">
      <WeatherForm getWeather={getWeather} />
      <div className="container">
        {console.log(current)}
        {current.error ? (
          <div className="cards">{current.error}</div>
        ) : (
          current.icon && (
            <div className="cards">
              <h1>
                {current.city}, {current.country}
              </h1>
              <h5 className="py-4">{current.icon}</h5>
              <h1 className="py-2">{current.celsius}&deg;</h1>

              {/* show max and min temp */}
              {minmaxTemp(current.temp_min, current.temp_max)}

              <h4 className="py-3">{current.description}</h4>
            </div>
          )
        )}
      </div>

      <Link to="/main">
        <div className="return2">Return to main</div>
      </Link>
    </div>
  );
};

const minmaxTemp = (min, max) => {
  return (
    <h3>
      <span className="px-4">{min}&deg;</span>
      <span className="px-4">{max}&deg;</span>
    </h3>
  );
};

export default Weather;
