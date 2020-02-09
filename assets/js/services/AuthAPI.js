import axios from "axios";
import jwtDecode from "jwt-decode";
import {AUTH_API} from "../config";

function logout() {
	window.localStorage.removeItem("authToken");
	delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
	return axios
		.post(AUTH_API, credentials)
		.then(response => response.data.token)
		.then(token => {
			window.localStorage.setItem("authToken",token);
			setAxiosToken(token);
		});
}

function setup() {
	// is token ?
	const token = window.localStorage.getItem("authToken");
	// token valid ?
	if (token) {
		const {exp: expiration} = jwtDecode(token);
		if (expiration * 1000 > new Date().getTime()) {
			setAxiosToken(token);
			console.log('Connexion ok avec axios');
		} else {
			logout();
			console.log('Disconnected with axios');
		}
	} else {
		logout();
		console.log('Disconnected with axios');
	}
}

function isAuthenticated() {
	// is token ?
	const token = window.localStorage.getItem("authToken");
	// token valid ?
	if (token) {
		const {exp: expiration} = jwtDecode(token);
		return expiration * 1000 > new Date().getTime();
	} else {
		return false;
	}
}

function setAxiosToken(token) {
	axios.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default {
	authenticate,
	logout,
	setup,
	isAuthenticated
}
