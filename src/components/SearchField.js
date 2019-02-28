import React, {Component} from "react";
// import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {connect} from "react-redux";
import {searchCity} from "../store/actions";
import Autosuggest from "react-autosuggest";
// import cities from "../../res/openweathermap/city.list.json";
// import cities from "../../res/openweathermap/few.cities.json";
// const cities = require("../../res/openweathermap/list.json");
import cities from "../res/openweathermap/current.city.list.json";
// import theme from "./AutoComplete.css";
import theme from "./AutoComplete.css";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}, {suggestion.country}
    </div>
);

class SearchField extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchCityName: "",
            value: '',
            suggestions: []
        };

        this.getSuggestions = this.getSuggestions.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.startsWith5 = this.startsWith5.bind(this);
    }

    handleChange(e) {
        console.log("event target value: " + e.target.value);
        this.setState({searchCityName: e.target.value});
        this.props.onSearchCity(e.target.value);
    };

    startsWith5(s, starter) {
        var i = starter.length;
        while (i--)
            if (s.charAt(i) !== starter.charAt(i))
                return false;
        return true;
    }

// Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions(value) {
        const inputValue = value;
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : cities.filter(city =>
                this.startsWith5(city.name, inputValue)
        );
    };

    onChange(event, {newValue})
    {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value })
    {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested ()
    {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method })
    {
        this.props.onSelect(suggestion);
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a city name',
            value,
            onChange: this.onChange
        };

        return (
            <div>
                <Autosuggest style={styles.searchBox}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                    onSuggestionSelected={this.onSuggestionSelected}
                />



                {/*<FormGroup controlId="searchField">*/}
                    {/*<ControlLabel>Search a City</ControlLabel><br/>*/}
                    {/*<FormControl*/}
                        {/*type="text"*/}
                        {/*value={this.state.searchCityName}*/}
                        {/*onChange={this.handleChange}*/}
                        {/*placeholder="Enter a City Name"*/}
                    {/*/>*/}
                    {/*<p>Form group</p>*/}
                {/*</FormGroup>*/}
                {/*<p>Search Field</p>*/}
            </div>
        );
    }
}



const mapStateToProps = state => {
    return {
        // searchCityName: state.searchCityName
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSearchCity: name => dispatch(searchCity(name))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchField);

const styles = {
    searchBox: {
        color: "red",
    }
};

// const styles = {
//     sugg: {
//         margin: "2rem",
//         padding: "1rem"
//     }
// };

// const styles = {
//     .container {
//     position: relative;
// }
//
// .input {
//     width: 100%;
//     height: 52px;
//     padding: 10px 20px;
//     font-family: Helvetica, sans-serif;
//     font-weight: 300;
//     font-size: 16px;
//     border: 1px solid #aaa;
//     border-radius: 4px;
// }
//
// .inputFocused {
//     outline: none;
// }
//
// .inputOpen {
//     border-bottom-left-radius: 0;
//     border-bottom-right-radius: 0;
// }
//
// .suggestionsContainer {
//     display: none;
// }
//
// .suggestionsContainerOpen {
//     display: block;
//     position: absolute;
//     top: 51px;
//     width: 100%;
//     border: 1px solid #aaa;
//     background-color: #fff;
//     font-family: Helvetica, sans-serif;
//     font-weight: 300;
//     font-size: 16px;
//     border-bottom-left-radius: 4px;
//     border-bottom-right-radius: 4px;
//     z-index: 2;
// }
//
// .suggestionsList {
//     margin: 0;
//     padding: 0;
//     list-style-type: none;
// }
//
// .suggestion {
//     cursor: pointer;
//     padding: 10px 20px;
// }
//
// .suggestionHighlighted {
//     background-color: #ddd;
// }
// }