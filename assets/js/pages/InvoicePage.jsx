import React, { useState, useEffect } from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {NavLink} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";

const InvoicePage = ({ history, match }) => {

	const { id = "new" } = match.params;

	const [invoice, setInvoice] = useState({
		amount: "",
		customer: "",
		status: "SENT"
	});

	const [customers, setCustomers] = useState([]);
	const [editing, setEditing] = useState(false);
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

	const fetchInvoice = async id => {
		try {
			const data = await axios.get("http://localhost:8000/api/invoices/" + id)
				.then(response => response.data);
			console.log(data);
			const { amount, status, customer } = data;
			// console.log('amount:',amount);
			// console.log('status:',status);
			// console.log('customer:',customer);
			// console.log('customer id:',customer.id);
			setInvoice({ amount, status, customer: customer.id });
		} catch (e) {
			console.log(e.response);
		}
	};

	// executed at component start because depends on none variable
	useEffect(() => {
		fetchCustomers();
	}, []);

	// executed at component start because depends on none variable
	useEffect(() => {
		if (id !== "new") {
			setEditing(true);
			fetchInvoice(id);
		}
	}, [id]);

	const handleChange = ({currentTarget}) => {
		const { name, value } = currentTarget;
		setInvoice({...invoice, [name]: value});
	};

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			if (editing) {
				const data = await axios.put(
					"http://localhost:8000/api/invoices/"+id,
					{...invoice, customer: `/api/customers/${invoice.customer}`}
				);
				// flash notification
			} else {
				const data = await axios.post(
					"http://localhost:8000/api/invoices",
					{...invoice, customer: `/api/customers/${invoice.customer}`}
				);
				// flash notification
				history.replace("/invoices");
			}

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
		<>
			<h1>{editing && "Modification de la facture" || "Création d'une facture"}</h1>
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
