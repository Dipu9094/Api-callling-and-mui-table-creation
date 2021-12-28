import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Details from "./components/Details";
import './App.css';

const Home = lazy(() => import("./components/Home"));
const Details = lazy(() => import("./components/Details"));

const App: React.FC = () => {
    return (
        <div>
            <Suspense fallback={<p>Loading........-------........</p>}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/details">
                            <Details />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </Suspense>
        </div>
    );
};

export default App;
