import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {NavLink} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";

const InvoicePage = ({ history }) => {
	const [invoice, setInvoice] = useState({
		amount: "",
		customer: "",
		status: "SENT"
	});

	const [customers, setCustomers] = useState([]);

	const [errors, setErrors] = useState({
		amount: "",
		customer: "",
		status: ""
	});

	const fetchCustomers = async () => {
		try {
			const data = await customersAPI.findAll();
			setCustomers(data);

			if (!invoice.customer) setInvoice({...invoice, customer: data[0].id});
		} catch (e) {
			console.log(e.response);
		}
	};

	// executed at component start because depends on none variable
	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleChange = ({currentTarget}) => {
		const { name, value } = currentTarget;
		setInvoice({...invoice, [name]: value});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			const data = await axios.post(
				"http://localhost:8000/api/invoices",
				{...invoice, customer: `/api/customers/${invoice.customer}`}
			);
			// flash notification
			history.replace("/invoices");
		} catch (e) {
			console.log(e.response);
		}
		console.log(invoice);
	};

	return (
		<>
			<h1>Création d'une facture</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="amount"
					type="number"
					placeholder="Montant de la facture"
					label="Montant"
					onChange={handleChange}
					value={invoice.amount}
					error={errors.amount}
				/>
				<Select
					name="customer"
					label="Client"
					onChange={handleChange}
					value={invoice.customer}
					error={errors.customer}
				>
					{customers.map(customer => (
						<option key={customer.id} value={customer.id}>
							{customer.firstName} {customer.lastName}
						</option>
					))}
				</Select>
				<Select
					name="status"
					label="Statut"
					onChange={handleChange}
					value={invoice.status}
					error={errors.status}
				>
					<option value="SENT">Envoyée</option>
					<option value="PAIED">Payée</option>
					<option value="CANCELLED">Annulée</option>
				</Select>
				<div className="form-group">
					<button type="submit" className="btn btn-success">Enregistrer</button>
					<NavLink to="/invoices" className="btn btn-link">Retour aux factures</NavLink>
				</div>
			</form>
		</>
	);
};

export default InvoicePage;
