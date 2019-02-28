import React, {Component} from "react";
// import {Card, Button, CardTitle, CardText} from 'react-mdl';
import {Card, Button} from "react-bootstrap";
// import {NavLink} from "react-router-dom";
// import Image from "react-bootstrap/Image";
import {connect} from "react-redux";
import moment from "moment";
import {asyncRemoveCity} from "../store/actions";


class WeatherCard extends Component {
    render() {
        const deleteCity = (city) => {
            this.props.onDeleteCity(city);
        };
        const weatherIcon = (icon) => {
            return this.props.city && this.props.city.weather && this.props.city.weather[0] && this.props.city.weather[0].icon ? `http://openweathermap.org/img/w/${this.props.city.weather[0].icon}.png` : null;
        };
        console.log("WeatherCard, props city", this.props.city);
        const temperature = () => {
              return this.props.city && this.props.city.main && this.props.city.main.temp ? this.props.city.main.temp.toFixed(1) : "";
        };
        const city = () => {
            const cityName = this.props.city && this.props.city.name ? this.props.city.name : "";
            const country = this.props.city && this.props.city.sys &&  this.props.city.sys.country ? this.props.city.sys.country : "";
            return cityName + ", " + country;
        };
        const descr = () => {
            return this.props.city && this.props.city.weather && this.props.city.weather[0] && this.props.city.weather[0].main ? this.props.city.weather[0].main : "";
        };
        const date = () => {
            if (this.props.city && this.props.city.dt) {
                const dateText = moment.unix(this.props.city.dt).format("YYYY-MM-DD HH:mm");
                return dateText;
            }
            return "";
        };
        return (!this.props.city ? null :
            <Card style={styles.card} bg="success" text="white">
                <Card.Title bg="primary"> {city()} <i className="fas fa-trash-alt" style={styles.deleteIcon} onClick={() => deleteCity(this.props.city)}></i></Card.Title>

                {/*<Card.Img className="fas fa-trash-alt"/>*/}
                <Card.Body>
                    <Card.Text><Card.Img src={weatherIcon()} style={styles.weatherIcon}/> {descr()} {temperature()} °C</Card.Text>
                    <Button onClick={() => this.props.details(this.props.city)} variant="primary">Weather Details</Button>
                </Card.Body>

                <Card.Text style={styles.smallText} text="dark">{date()} (UTC)</Card.Text>


            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        weather: state.weatherData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // onSetActiveCity: (cityWeather) => dispatch(setActiveCity(cityWeather)),
        onDeleteCity: (city) => dispatch(asyncRemoveCity(city))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherCard);

const styles = {
    card: {
        // width: "10rem",
        // backgroundColor: "lightyellow",
        // color: "gray",
        margin: "2rem",
        padding: "1rem",
        display: "inline-block",
        // backgroundColor: "#66bb6a",
        // borderRadius: "10px",
        // textAlign: "center"
    },
    weatherIcon: {
        width: "2.5rem",
        float: "left",
        margin: "0px",
        padding: "0px"
    },
    smallText: {
        fontSize: "xx-small",
        fontStyle: "italic",
        // float: "right",
        float: "left",
        color: "lightgray"
    },
    deleteIcon: {
        float: "right",
        color: "lightgray"
    },
    button: {
        // borderRadius: "5px",
        // backgroundColor: "#00b0ff",
        // padding: ".5rem",
        // color: "white",
        // fontWeight: "bold",
        // width: "95%",
        // width: "20rem",
        float: "left",
        // marginBottom: ".5rem",
    },
};