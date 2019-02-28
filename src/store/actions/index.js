import {
    GET_CITY_WEATHER,
    // INIT_DB,
    REMOVE_CITY,
    SEARCH_CITY,
    SET_ACTIVE_CITY,
    UPDATE_CITY_WEATHER,
    UPDATE_DATABASE
} from "./actionTypes";
// import citylist from '../../../res/openweathermap/city.list.min';
import axios from "axios";
import localForage from "localforage";

import _ from "lodash";

const apiKey = "db610e9a76b92b4266340c5f5e8fb178";

// const reduceDB = (currentCities) => {
//     console.log("actions, reduceDB, currentCities", currentCities);
//     return {type: INIT_DB, currentCities: currentCities};
// };

// const initDatabase = (cities) => {
//     console.log("!!!!!actions, initDatabase, cities", cities);
//     return dispatch => {
//         dispatch(reduceDB(cities));
//     }
// };

export const initDB = () => {
    return new Promise((resolve, reject) => {
        console.log("actions initDB");
        // return dispatch => {
        console.log("actions initDB, DISPATCH");
        localForage.config({
            driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
            name: "helloWeatherAppForage",
            version: 1.0,
            storeName: "weatherDataStorage", // Should be alphanumeric, with underscores.
            description: "no description"
        });
        console.log("Database init complete");
        let currentCities = [];
        localForage.iterate((cityDataFromDb, key, iterationNumber) => {
            // console.log("iterate, ");
            // console.log("actions init db cityData", cityDataFromDb);
            // let currentCities = _.cloneDeep(state.savedCities);
            currentCities.push(cityDataFromDb);
            // console.log("actions init db, CURRENTCITIES AFTER", currentCities);
            // this.setState({ savedCities: currentCities });
            // this.updateCityWeather(cityDataFromDb);
        // }).then(function () {
        //     // console.log("actions, init db CURRENT CITIES DONE, ", currentCities);
        //     // console.log("DB initial load has completed");
        //     // return {...state, savedCities: currentCities};
        //     // console.log("##########actions, initDB, currentCities", currentCities);
        //     // updateDatabase(currentCities);
        //     // dispatch(reduceDB(currentCities));
        //     // localForage.iterate((city, key, iterationNumber) => {
        //     //     // let currentCities = _.cloneDeep(savedCities);
        //     //     // currentCities.push(city);
        //     //     // console.log("actions, initDB, iterate localForage, city: ", city);
        //     //     // console.log("actions, asyncUpdateDB, calling asyncUpdateCityWeather, city id", city.id);
        //     //     asyncUpdateCityWeather(city.id);
        //     // })
        //     // .then(function () {
        //     //     console.log("actions, initDB, DB initial load has completed, current cities: ", currentCities);
        //     //     return dispatch => dispatch(updateDB(currentCities));
        //     //     // initDatabase(currentCities);
        //     // });
        });
        resolve(currentCities);
    });
};

export const searchCity = (name) => {
    console.log("Start search");
    // const cities = _.find(citylist, {"name": name});
    // const cities = _.filter(citylist, function(city) {
    //     return _.startsWith(_.lowerCase(city.name), _.lowerCase(name));
    // });
    console.log("Search done");
    // console.log(cities);
    return {type: SEARCH_CITY, cities: []};
};

const getCityWeather = (weatherData) => {
    console.log("actions getCityWeather, weatherData", weatherData);
    return {
        type: GET_CITY_WEATHER, weatherData
    };
};

const getWeatherFromServer = (cityID) => {
    console.log("action, getWeatherFromServer, id", cityID);
    const uri = `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&APPID=${apiKey}&units=metric`;
    console.log("actions asyncGetCityWeather uri: ", uri);
    return new Promise((resolve, reject) => {
        axios.get(uri)
        .then(response => {
            console.log("actions, getWeatherFromServer, response", response);
            if (response.status === 200) {
                console.log("actions, getWeatherFromServer, data", response.data);
                resolve(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
            reject(error);
        });
    });
};




export const asyncGetCityWeather = (cityID) => {
    console.log("actions, asyncGetCityWeather, cityID", cityID);
    return dispatch => {
        console.log("actions, asyncGetCityWeather, calling getWeatherFromServer");
        getWeatherFromServer(cityID)
        .then(weatherData => {
            console.log("actions, asyncGetCityWeather, back from  getWeatherFromServer");
            console.log("actions, asyncGetCitySWeather, weatherData", weatherData);
            if (weatherData) {
                getWeatherForecastFromServer(cityID)
                .then(forecast => {
                    console.log("actions, asyncGetCitySWeather, forecast", forecast);
                    weatherData.forecast = forecast;
                    dispatch(getCityWeather(weatherData));
                });
            }
        });
    };
};

const updateCityWeather = (weatherData) => {
    return {type: UPDATE_CITY_WEATHER, weatherData};
};

export const asyncUpdateCityWeather = (cityID) => {
    console.log("actions, asyncUpdateCityWeather, cityID", cityID);
    return dispatch => {
        getWeatherFromServer(cityID)
        .then(weatherData => {
            console.log("actions, asyncUpdateCityWeather, weather data", weatherData);
            if (weatherData) {
                getWeatherForecastFromServer(cityID)
                .then(forecast => {
                    console.log("actions, asyncUpdateCityWeather, forecast", forecast);
                    if (forecast) {
                        weatherData.forecast = forecast;
                        dispatch(updateCityWeather(weatherData));
                    }
                });
            }
        });
    };
};

const getWeatherForecastFromServer = (cityID) => {
    console.log("action, getWeatherFromServer, id", cityID);
    const uri = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&APPID=${apiKey}&units=metric`;
    console.log("actions asyncGetCityWeather uri: ", uri);
    return new Promise((resolve, reject) => {
        axios.get(uri)
        .then(response => {
            console.log("actions, getWeatherFromServer, response", response);
            if (response.status === 200) {
                console.log("actions, getWeatherFromServer, data", response.data);
                let currentWeather = response.data;
                resolve(currentWeather);
            }
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });;
    });
};

const updateDB = (currentCities) => {
    return {type: UPDATE_DATABASE, currentCities: currentCities, success: true};
};

// const updateDatabase = (cities) => {
//     return new Promise((resolve, reject) => {
//         let currentCities = _.cloneDeep(cities);
//         localForage.iterate((city, key, iterationNumber) => {
//             // let currentCities = _.cloneDeep(savedCities);
//             currentCities.push(city);
//             console.log("actions, updateDatabase, city: ", city);
//             // console.log("actions, asyncUpdateDB, calling asyncUpdateCityWeather, city id", city.id);
//             asyncUpdateCityWeather(city.id);
//         })
//         .then(function () {
//             console.log("actions, asyncUpdateDDB, DB initial load has completed, current cities: ", currentCities);
//             reduceDB(currentCities);
//         });
//     });
// };

export const asyncUpdateDB = (savedCities) => {
    return dispatch => {
        console.log("actions, asyncUpdateDB, cities", savedCities);
        let currentCities = _.cloneDeep(savedCities);
        localForage.iterate((city, key, iterationNumber) => {
            // let currentCities = _.cloneDeep(savedCities);
            currentCities.push(city);
            console.log("actions, asyncUpdateDB, city: ", city);
            // console.log("actions, asyncUpdateDB, calling asyncUpdateCityWeather, city id", city.id);
            asyncUpdateCityWeather(city.id);
        })
        .then(function () {
            console.log("actions, asyncUpdateDDB, DB initial load has completed, current cities: ", currentCities);
            dispatch(updateDB(currentCities));
        });
    };
};

export const setActiveCity = (cityWeather) => {
    console.log("actions, setActiveCity, cityWeather", cityWeather);
    return {type: SET_ACTIVE_CITY, cityWeather};
};

const removeCity = (city) => {
    return {type: REMOVE_CITY, city};
};

export const asyncRemoveCity = (city) => {
    return dispatch => {
        console.log("action, removeCity city", city);
        localForage.removeItem(city.id.toString())
        .then(function () {
            // Run this code once the key has been removed.
            console.log("Key is cleared!");
            dispatch(removeCity(city));
        }).catch(function (err) {
            // This code runs if there were any errors
            console.log(err);
        });
    }
};
