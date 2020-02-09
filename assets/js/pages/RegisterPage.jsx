import React, { useState} from 'react';
import Field from "../components/forms/Field";
import {NavLink} from "react-router-dom";
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";

const RegisterPage = () => {

	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: ""
	});

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: ""
	});

	const handleChange = ({currentTarget}) => {
		const { name, value } = currentTarget;
		setUser({...user, [name]: value});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		const apiErrors = {};
		if (user.password !== user.passwordConfirm) {
			apiErrors.passwordConfirm = "Vos mots de passent doivent correspondre.";
			setErrors(apiErrors);
			return;
		}

		try {
			await usersAPI.register(user);
			// flash notification
			toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter.");
			setErrors({});
			history.replace("/login");
		} catch (error) {
			const { violations } = error.response.data;
			if (violations) {
				violations.forEach(({propertyPath, message}) => {
					apiErrors[propertyPath] = message;
				});
				setErrors(apiErrors);
				toast.warn("Des erreurs dans votre formulaire...");
				// flash notification
			}
		}
	};

	return (
		<div>
			<h1>Inscription</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="firstName"
					label="Prénom"
					placeholder="Votre prénom"
					error={errors.firstName}
					value={user.firstName}
					onChange={handleChange}
				/>
				<Field
					name="lastName"
					label="Nom de famille"
					placeholder="Votre nom de famille"
					error={errors.lastName}
					value={user.lastName}
					onChange={handleChange}
				/>
				<Field
					name="email"
					type="email"
					label="Adresse e-mail"
					placeholder="Votre adresse e-mail"
					error={errors.email}
					value={user.email}
					onChange={handleChange}
				/>
				<Field
					name="password"
					type="password"
					label="Mot de passe"
					placeholder="Votre mot de passe"
					error={errors.password}
					value={user.password}
					onChange={handleChange}
				/>
				<Field
					name="passwordConfirm"
					type="password"
					label="Confirmez votre mot de passe"
					placeholder="Veuillez confirmer votre mot de passe"
					error={errors.passwordConfirm}
					value={user.passwordConfirm}
					onChange={handleChange}
				/>
				<div className="form-group">
					<button type="submit" className="btn btn-success">Valider mon inscription</button>
					<NavLink to="/login" className="btn btn-link">J'ai déjà un compte.</NavLink>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
