import {
    GET_CITY_WEATHER,
    INIT_DB,
    REMOVE_CITY,
    SET_ACTIVE_CITY,
    UPDATE_CITY_WEATHER,
    UPDATE_DATABASE
} from "../actions/actionTypes";
import localForage from "localforage";
import _ from "lodash";

const initialState = {
    weatherData: {},
    forecast: {},
    savedCities: [],
    activeCityWeather: {}
};

const WeatherApp = (state = initialState, action) => {
    switch (action.type) {
        case "SEARCH_CITY":
            const newState1 = {...state, cities: action.cities};
            console.log("newState: ", newState1);
            return newState1;
        case INIT_DB:
            console.log("reducer, init db");
            /* Load items from database and populate the current state */
            let currentCities = action.currentCities;
            // currentCities =  _.cloneDeep(state.savedCities);
            // localForage.iterate((cityDataFromDb, key, iterationNumber) => {
            //     console.log("reducer init db cityDataFromDb BEFORE: ", cityDataFromDb);
            //     currentCities = _.cloneDeep(state.savedCities);
                // console.log("reducer init db, currentCities AFTER: ", currentCities);
                // currentCities.push(cityDataFromDb);
                // this.setState({ savedCities: currentCities });
                // this.updateCityWeather(cityDataFromDb);
            // }).then(function() {
            //     console.log("DB initial load has completed");
            //     console.log("⁄⁄⁄⁄⁄⁄⁄⁄⁄⁄⁄⁄⁄⁄¡¡¡¡¡¡¡¡¡¡¡¡¡¡reducer init db, currentCities: ", currentCities);
            const newState2 = {...state, savedCities: currentCities};
            console.log("reducer, init db, new state: ", newState2);
            return newState2;
        case UPDATE_DATABASE:
            console.log("reducer, update database");
            const currentCities2 = action.currentCities;
            console.log("reducer, update database, current cities", currentCities2);
            if (currentCities2) {
                const newState3 = {...state, savedCities: currentCities2};
                console.log("reducer, update database, current cities not null, new state: ", newState3);
                return newState3;
            } else {
                return state;
            }
        case GET_CITY_WEATHER:
            const weatherData = action.weatherData;
            // const forecast = action.forecast;
            console.log("reducer get city weather, data", weatherData);
            const savedCities2 = _.cloneDeep(state.savedCities);
            if (state.savedCities.find(cityWeather => cityWeather.id === weatherData.id) === undefined) {
                savedCities2.unshift(weatherData);
                localForage.setItem(weatherData.id.toString(), weatherData)
                .then(function () {
                    console.log("reducer get city weather, item added to database", weatherData)
                }).catch(function (err) {
                    // we got an error
                    console.log("!!!!reducer get city weather, db error");
                });
                // this.setState({savedCities});
                // return {...state, savedCities, weatherData, forecast}
            }
            return {...state, savedCities: savedCities2, weatherData};
        case UPDATE_CITY_WEATHER:
            console.log("reducer, update, city weather");
            const newWeatherData = action.weatherData;
            const forecast2 = action.weatherData.forecast;
            const savedCities3 = _.cloneDeep(state.savedCities);
            console.log("reducer, update, city weather, weather: ", newWeatherData, ", forecast: ", forecast2, ", cities: ", savedCities3);
            const stateIndex = state.savedCities.findIndex(
                cityWeather => cityWeather.id === newWeatherData.id
            );
            if (stateIndex !== undefined) {
                /* clone the current elements, state should be immutable */
                // savedCities = _.cloneDeep(state.savedCities);
                savedCities3[stateIndex].weatherData = newWeatherData;
                savedCities3[stateIndex].forecast = forecast2;
                /* Update data in the database */
                localForage.setItem(newWeatherData.id.toString(), newWeatherData, forecast2).then(function () {
                    console.log(`${newWeatherData.name} item update to database`);
                }).catch(function (err) {
                    console.log("db update error");
                });
                /* Update the state with the update data */
                // this.setState({ savedCities });
                return {...state, weatherData: newWeatherData, forecast2};
            } else {
                savedCities3.push(newWeatherData);
                return {...state, savedCities: savedCities3};
            }
        case SET_ACTIVE_CITY:
            console.log("reducers, set active city, weather", action.cityWeather);
            return {...state, activeCityWeather: action.cityWeather};
        case REMOVE_CITY:
            const removeCity = action.city;
            const savedCities4 = _.cloneDeep(state.savedCities);
            const removeIndex = state.savedCities.findIndex(savedCity => savedCity.id === removeCity.id);
            if (removeIndex !== undefined) {
                savedCities4.splice(removeIndex, 1);
                return {...state, savedCities: savedCities4};
            }
            return state;
        default:
            return state
    }
};

export default WeatherApp