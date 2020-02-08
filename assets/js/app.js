import React, { useState } from "react";
import ReactDOM from "react-dom"
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import '../css/app.css';
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";

AuthAPI.setup();

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

	const NavbarWithRouter = withRouter(Navbar);

	return (
		<AuthContext.Provider value={{
			isAuthenticated,
			setIsAuthenticated
		}}>
			<HashRouter>
				<NavbarWithRouter />
				<main className="container pt-5">
					<Switch>
						<Route path="/login" component={LoginPage}/>
						<PrivateRoute path="/invoices/:id" component={InvoicePage} />
						<PrivateRoute path="/invoices" component={InvoicesPage} />
						<PrivateRoute path="/customers/:id" component={CustomerPage} />
						<PrivateRoute path="/customers" component={CustomersPage} />
						<Route path="/" component={HomePage}/>
					</Switch>
				</main>
			</HashRouter>
		</AuthContext.Provider>
	)
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);