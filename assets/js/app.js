import React, { useState } from "react";
import ReactDOM from "react-dom"
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import '../css/app.css';
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";

AuthAPI.setup();

const PrivateRoute = ({ path, isAuthenticated, component }) =>
	isAuthenticated ? (
		<Route path={path} component={component}/>
		) : (
			<Redirect to="/login"/>
			);

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

	const NavbarWithRouter = withRouter(Navbar);

	const contextValue = {
		isAuthenticated,
		setIsAuthenticated
	};

	return (
		<AuthContext.Provider value={contextValue}>
			<HashRouter>
				<NavbarWithRouter
					isAuthenticated={isAuthenticated}
					onLogout={setIsAuthenticated}
				/>
				<main className="container pt-5">
					<Switch>
						<Route
							path="/login"
							render={props => (<LoginPage onLogin={setIsAuthenticated} {...props}/>)}
						/>
						<PrivateRoute path="/customers" isAuthenticated={isAuthenticated} component={CustomersPage} />
						<PrivateRoute path="/invoices" isAuthenticated={isAuthenticated} component={InvoicesPage} />
						<Route path="/" component={HomePage}/>
					</Switch>
				</main>
			</HashRouter>
		</AuthContext.Provider>
	)
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);
