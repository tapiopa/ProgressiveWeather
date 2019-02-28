import React, {Component} from "react";

class ShortWeather extends Component {
    render() {
        console.log("ShortWeather, this.props", this.props);
        return (
            <div>
                {/*<p>City: {this.props.weather && this.props.weather.name ? this.props.weather.name : null}</p>*/}
                {/*<p>Temperature: {this.props.weather && this.props.weather.main && this.props.weather.main.temp ?*/}
                {/*this.props.weather.main.temp : null} °C</p>*/}
                {/*<p>Humidity: {this.props.weather && this.props.weather.main && this.props.weather.main.humidity ?*/}
                {/*this.props.weather.main.humidity : null} %</p>*/}
                {/*<p>Air Pressure: {this.props.weather && this.props.weather.main && this.props.weather.main.pressure ?*/}
                {/*this.props.weather.main.pressure : null} hPa</p>*/}
            </div>
        );
    }
}

export default ShortWeather;