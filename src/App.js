import React, {Component} from "react";
import {connect} from "react-redux";

import {asyncGetCityWeather, initDB, asyncUpdateDB, setActiveCity} from "./store/actions/";

import SearchField from "./components/SearchField";
import WeatherCard from "./components/WeatherCard";
// import {Route, Switch, withRouter} from "react-router-dom";
// import WeatherDetails from "./components/WeatherDetails";

class App extends Component {
    constructor(props) {
        super(props);
        this.getCityWeather = this.getCityWeather.bind(this);
        this.initDB = this.initDB.bind(this);
        this.updateDatabase = this.updateDatabase.bind(this);
        this.showDetails = this.showDetails.bind(this);

        initDB()
        .then(currentCities => this.props.onUpdateDB(currentCities));
    }

    initDB() {
        console.log("App, initDB");
        this.props.onInitDB();
    }

    updateDatabase(withCities) {
        console.log("App, updateDatabase, cities", withCities);
        this.props.onUpdateDB(withCities);
    }

    componentDidMount() {
        // console.log("app componentDidMount, savedCities", this.props.savedCities);

        // if (this.props.savedCities) {
        //     this.updateDatabase(this.props.savedCities);
        // }
    }

    componentWillReceiveProps(nextProps, nextContent) {
        console.log("App, componentWillReceiveProps, nextProps", nextProps);
    }

    getCityWeather(selectedCity) {
        console.log("App.js getCityWeather, selectedCity.id", selectedCity.id);
        this.props.onGetCityWeather(selectedCity.id);
    };

    showDetails(city) {
        console.log("App.js, showDetails, city", city);
        this.props.onSetActiveCity(city);
        this.props.history.push("/details");
    }

    render() {
        if (this.props && this.props.savedCities) {
            console.log("App.js, savedCities", this.props.savedCities);
        } else if (this.props) {
            console.log("App, props", this.props);
        } else {
            console.log("App, NO PROPS");
        }
        return (
            <div style={styles.app} className="primary">
                {/*<Switch>*/}
                    {/*<Route path="/details" component={WeatherDetails}/>*/}
                    {/*<Route exact path="/" component={App}/>*/}
                {/*</Switch>*/}
                {/*<p>App</p>*/}
                <SearchField style={styles.search} onSelect={(selectedCity) => {
                    console.log(selectedCity);
                    this.getCityWeather(selectedCity);
                }} />
                {this.props && this.props.savedCities && this.props.savedCities.map(city => {
                    return <WeatherCard
                        city={city}
                        details={this.showDetails}
                    />
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        weather: state.weatherData,
        // weather1: state.data,
        savedCities: state.savedCities,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetCityWeather: (cityID) => {
            console.log("DISPATCH to asyncGetCityWeather, cityID", cityID);
            dispatch(asyncGetCityWeather(cityID))
        },
        onInitDB: () => dispatch(initDB()),
        onUpdateDB: (withCities) => dispatch(asyncUpdateDB(withCities)),
        onSetActiveCity: (cityWeather) => dispatch(setActiveCity(cityWeather)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App;

const styles = {
    app: {
        backgroundColor: "#0275d8",
        // width: "17rem",
        height: "50rem",
        textAlign: "center",
        paddingTop: "2rem",
    },
    search: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2rem",
    },
};