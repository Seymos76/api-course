import React, { useState, useContext } from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({ history }) => {
	const {setIsAuthenticated} = useContext(AuthContext);
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState('');

	const handleChange = ({currentTarget}) => {
		const {value, name} = currentTarget;
		setCredentials({...credentials, [name]: value});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			await AuthAPI.authenticate(credentials);
			setError("");
			setIsAuthenticated(true);
			toast.success("Vous êtes connecté !");
			history.replace("/customers");
		}catch (e) {
			setError("Aucun compte ne possède cette adresse ou les informations ne correspondent pas.");
			toast.error("Une erreur est survenue.");
		}
	};

	return (
		<>
			<h1>Connexion à l'application</h1>
			<form onSubmit={handleSubmit}>
				<Field
					label="Adresse email"
					name="username"
					value={credentials.email}
					onChange={handleChange}
					placeholder="Adresse email de connexion"
					error={error}
				/>
				<Field
					label="Mot de passe"
					name="password"
					type="password"
					value={credentials.password}
					onChange={handleChange}
					error={""}
				/>
				<button type="submit" className="btn btn-primary">Connexion</button>
			</form>
		</>
	);
};

export default LoginPage;
