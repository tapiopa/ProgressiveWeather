import React from "react";
import ReactDom from "react-dom"
import App from "./App";
// import WeatherDetails from './components/WeatherDetails';

import {Provider} from "react-redux"
import {createStore, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import WeatherApp from "./store/reducers";
import WeatherDetails from "./components/WeatherDetails";
// import WeatherDetails from "./components/WeatherDetails";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const logger = store => {
    return next => {
        return action => {
            console.log("[Middleware] Dispatching", action);
            const result = next(action);
            console.log("[Middleware] next state", store.getState());
            return result;
        };
    };
};
let store = createStore(WeatherApp, composeEnhancers(applyMiddleware(logger, thunk)));

const reactTarget = document.getElementById("root");

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/details" component={WeatherDetails}/>
                <Route exact path="/" component={App}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    reactTarget);

// ReactDom.render(
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>,
//     reactTarget);

// ReactDom.render(<App />, reactTarget);

console.log("Main.js, webpack bundle works");
