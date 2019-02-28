import React, {Component} from "react";

import {Card, Button} from "react-bootstrap";
import {connect} from "react-redux";
// import Image from "./WeatherCard";
import moment from "moment";

class WeatherDetails extends Component {


    constructor(props, context) {
        super(props, context);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        console.log("WeatherDetails, props", this.props);
        console.log("WeatherDetails, weather icon exists", this.props.weather && this.props.weather.weather && this.props.weather.weather[0] &&
            this.props.weather.weather[0].icon);
        console.log("WeatherDetails, rain", this.props.weather && this.props.weather.rain ? this.props.weather.rain : null);

        const weatherIcon = () => {
            if (this.props.weather && this.props.weather.weather && this.props.weather.weather[0] && this.props.weather.weather[0].icon) {
                const iconName = this.props.weather.weather[0] && this.props.weather.weather[0].icon;
                if (iconName !== undefined || iconName !== "undefined") {
                    const pathToIcon = `http://openweathermap.org/img/w/${iconName}.png`;
                    console.log("Weatherdetails, weatherIcon pathToIcon: ", pathToIcon);
                    return pathToIcon;
                }
            }
            return null;
        };

        const windDirection = (degrees) => {
            if (degrees < 22.5) {
                return "N";
            }
            // else if (degrees < 45)    { return "NE"; }
            else if (degrees < 67.5) {
                return "NE";
            }
            // else if (degrees < 90)    { return "E"; }
            else if (degrees < 112.5) {
                return "E";
            }
            // else if (degrees < 135)   { return "N"; }
            else if (degrees < 157.5) {
                return "SE";
            }
            // else if (degrees < 180)   { return "N"; }
            else if (degrees < 202.5) {
                return "S";
            }
            // else if (degrees < 225)   { return "N"; }
            else if (degrees < 247.5) {
                return "SW";
            }
            // else if (degrees < 270)   { return "N"; }
            else if (degrees < 292.5) {
                return "W";
            }
            // else if (degrees < 315)   { return "N"; }
            else if (degrees < 337.5) {
                return "NW";
            } else if (degrees >= 337.5) {
                return "N";
            }
        };
        // const getRainPath() {
        //     if (this.props.weather && this.props.weather.rain) {
        //
        //     }
        // }
        const showRain = () => {
            if (this.props.weather && this.props.weather.rain) {
                console.log("WeatherDetails, rain: ", this.props.weather.rain);
                let duration = null;
                let rain = null;
                for (let [key, value] of Object.entries(this.props.weather.rain)) {
                    console.log("weatherdetails, rain object");
                    console.log(key, value);
                    duration = key;
                    rain = +value.toFixed(1);
                }
                return (<Card.Text>Rain ({duration}): {rain} mm</Card.Text>);
            } else if (this.props.weather && this.props.weather.snow) {
                console.log("WeatherDetails, snow: ", this.props.weather.snow);
                let duration = null;
                let snow = null;
                for (let [key, value] of Object.entries(this.props.weather.snow)) {
                    console.log("weatherdetails, rain object");
                    console.log(key, value);
                    duration = key;
                    snow = +value.toFixed(1);
                }
                return (<Card.Text>Snow ({duration}): {snow} mm</Card.Text>);
            }
            return "";
        };
        const temperature = () => {
            return this.props.weather && this.props.weather.main && this.props.weather.main.temp ? this.props.weather.main.temp.toFixed(1) : "";
        };
        const city = () => {
            return this.props.weather && this.props.weather.name ? this.props.weather.name : "";
        };
        const descr = () => {
            const description = this.props.weather && this.props.weather.weather && this.props.weather.weather[0] && this.props.weather.weather[0].description ? this.props.weather.weather[0].description : "";
            return nameCapitalized(description);
        };
        const date = () => {
            if (this.props.weather && this.props.weather.dt) {
                const dateText = moment.unix(this.props.weather.dt).format("YYYY-MM-DD HH:mm");
                return dateText;
            }
            return "";
        };
        const humidity = () => {
            return this.props.weather && this.props.weather.main && this.props.weather.main.humidity ? this.props.weather.main.humidity : "";
        };
        const pressure = () => {
            return this.props && this.props.weather && this.props.weather.main && this.props.weather.main.pressure ?
                this.props.weather.main.pressure : "";
        };
        const wind = () => {
            return (<Card.Text>Wind: {this.props.weather && this.props.weather.wind && this.props.weather.wind.deg ?
                windDirection(this.props.weather.wind.deg) : null} {this.props.weather && this.props.weather.wind && this.props.weather.wind.speed ?
                this.props.weather.wind.speed : null} m/s</Card.Text>);
        };
        const nameCapitalized = (name) => name.charAt(0).toUpperCase() + name.slice(1);
        return (
            <div style={styles.details}>
                <Card style={styles.card} bg="success" text="white">
                    <Card.Title>Weather Details for {city()}</Card.Title>
                    <Card.Body>
                        <Card.Img style={styles.weatherIcon} src={weatherIcon()} />
                        <Card.Text>{descr()}</Card.Text>
                        <Card.Text>Temperature: {temperature()} °C</Card.Text>
                        <Card.Text>Humidity: {humidity()} %</Card.Text>
                        {showRain()}
                        <Card.Text>Air Pressure: {pressure()} hPa</Card.Text>
                        {wind()}
                        <Button variant="primary" style={styles.backButton} onClick={this.goBack}>Go Back</Button>
                    </Card.Body>
                    <Card.Text style={styles.smallText}>{date()} (UTC)</Card.Text>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        weather: state.activeCityWeather,
    };
};

export default connect(mapStateToProps)(WeatherDetails);

const styles = {
    card: {
        // width: "14rem",
        // backgroundColor: "#66bb6a",
        // color: "white",
        margin: "1rem",
        padding: "1rem",
        display: "inline-block"
        // borderRadius: "10px",
    },
    body: {
        padding: "4rem"
    },
    weatherIcon: {
        width: "2.5rem",
        float: "left"
    },
    smallText: {
        fontSize: "xx-small",
        fontStyle: "italic",
        // float: "right!",
        float: "left",
        color: "lightgray"
    },
    details: {
        backgroundColor: "#0275d8",
        // width: "20rem",
        height: "50rem",
        paddingTop: "2rem",
        margin: "0px",
    },
    backButton: {
        // borderRadius: "5px",
        // backgroundColor: "#00b0ff",
        // padding: ".5rem",
        // color: "white",
        // fontWeight: "bold",
        width: "95%",
        // width: "20rem",
    }
};