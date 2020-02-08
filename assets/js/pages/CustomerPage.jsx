import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Field";
import {NavLink} from "react-router-dom";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history}) => {

	const { id = "new" } = match.params;

	const [customer, setCustomer] = useState({
		lastName: "THOMAS",
		firstName: "Louis",
		email: "",
		company: ""
	});

	const [errors, setErrors] = useState({
		lastName: "",
		firstName: "",
		email: "",
		company: ""
	});

	const [editing, setEditing] = useState(false);

	const fetchCustomer = async id => {
		try {
			const { firstName, lastName, email, company } = await customersAPI.findOne(id);
			setCustomer({ firstName, lastName, email, company });
		} catch (e) {
			console.log(e.response);
			// flash notification
			history.replace("/customers");
		}
	};

	// load customer on component load or id changing
	useEffect(() => {
		if (id !== "new") {
			setEditing(true);
			fetchCustomer(id);
		} else {
			setEditing(false);
		}
	}, [id]);

	// handle form input changes
	const handleChange = ({currentTarget}) => {
		const { name, value } = currentTarget;
		setCustomer({...customer, [name]: value});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			if (editing) {
				await customersAPI.update(id, customer);
				// flash notification
				history.replace("/customers");
			} else {
				const response = await customersAPI.create(customer);
				// flash notification
				history.replace("/customers");
			}
			setErrors({});
		} catch ({ response }) {
			const { violations } = response.data;
			if (violations) {
				const apiErrors = [];
				violations.forEach(({propertyPath, message}) => {
					apiErrors[propertyPath] = message;
				});
				setErrors(apiErrors);
				// flash notification
			}
		}
	};

	return (
		<div>
			{!editing && <h1>Création d'un client</h1> || <h1>Edition d'un client</h1>}
			<form onSubmit={handleSubmit}>
				<Field
					name="lastName"
					label="Nom de famille"
					placeholder="Nom de famille du client"
					value={customer.lastName}
					onChange={handleChange}
					error={errors.lastName}
				/>
				<Field
					name="firstName"
					label="Prénom"
					placeholder="Prénom du client"
					value={customer.firstName}
					onChange={handleChange}
					error={errors.firstName}
				/>
				<Field
					name="email"
					label="Email"
					type="email"
					placeholder="Adresse e-mail du client"
					value={customer.email}
					onChange={handleChange}
					error={errors.email}
				/>
				<Field
					name="company"
					label="Entreprise"
					placeholder="Entreprise du client"
					value={customer.company}
					onChange={handleChange}
					error={errors.company}
				/>

				<div className="form-group">
					<button type="submit" className="btn btn-success">Enregistrer</button>
					<NavLink to="/customers" className="btn btn-link">Retour à la liste</NavLink>
				</div>
			</form>
		</div>
	);
};

export default CustomerPage;