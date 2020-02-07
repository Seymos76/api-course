import React from "react";
import ReactDOM from "react-dom"
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import '../css/app.css';
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

console.log('Hello world !');

const App = () => {
	return <HashRouter>
		<Navbar/>
		<main className="container pt-5">
			<Switch>
				<Route path="/invoices" component={InvoicesPage}/>
				<Route path="/customers" component={CustomersPage}/>
				<Route path="/" component={HomePage}/>
			</Switch>
		</main>
	</HashRouter>
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);
