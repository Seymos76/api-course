import React, { useEffect, useState } from 'react';
import moment from "moment"
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import axios from "axios";
import {NavLink} from "react-router-dom";

const STATUS_CLASSES = {
	PAIED: "primary",
	SENT: "info",
	CANCELLED: "danger"
};

const STATUS_LABELS = {
	PAIED: "Payée",
	SENT: "Envoyée",
	CANCELLED: "Annulée"
};

const InvoicesPage = (props) => {
	const [invoices, setInvoices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState('');

	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll();
			setInvoices(data);
		} catch (e) {
			console.log('error fetching invoices:',e.response);
		}
	};

	useEffect(() => {
		fetchInvoices();
	}, []);

	const handlePageChange = page => {
		setCurrentPage(page);
	};

	const handleSearch = ({currentTarget}) => {
		setSearch(currentTarget.value);
	};

	const handleDelete = async id => {
		const originalInvoices = [...invoices];
		setInvoices(invoices.filter(invoice => invoice.id !== id));
		try {
			await axios.delete("http://localhost:8000/api/invoices/"+id);
		} catch (e) {
			setInvoices(originalInvoices);
		}
	};

	const handleUpdate = async id => {
		console.log('handle invoice update:',id);
	};

	const itemsPerPage = 10;

	const formatDate = (str) => moment(str).format('DD/MM/YYYY');

	const filteredInvoices = invoices.filter(i =>
		i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
		i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
		i.amount.toString().startsWith(search.toLowerCase()) ||
		STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	);

	const paginatedInvoices = filteredInvoices.length > itemsPerPage ? Pagination.getData(
		filteredInvoices,
		currentPage,
		itemsPerPage
	): filteredInvoices;

	return (
		<>
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des factures</h1>
				<NavLink to="/invoices/new" className="btn btn-primary">Ajouter une facture</NavLink>
			</div>

			<div className="form-group">
				<input onChange={handleSearch} value={search} type="search" className="form-control" placeholder="Rechercher..."/>
			</div>

			<table className="table table-hover">
				<thead>
				<tr>
					<th>Numéro</th>
					<th>Client</th>
					<th className="text-center">Date d'envoi</th>
					<th className="text-center">Statut</th>
					<th className="text-center">Montant</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{paginatedInvoices.map(invoice => <tr key={invoice.id}>
					<td>{invoice.chrono}</td>
					<td>
						<NavLink to={`/invoices/${invoice.id}`}>{invoice.customer.firstName} {invoice.customer.lastName}</NavLink>
					</td>
					<td className="text-center">{formatDate(invoice.sentAt)}</td>
					<td className="text-center">
						<span className={`badge badge-${STATUS_CLASSES[invoice.status]}`}>{STATUS_LABELS[invoice.status]}</span>
					</td>
					<td className="text-center">{invoice.amount.toLocaleString()} €</td>
					<td>
						<NavLink to={`/invoices/${invoice.id}`} className="btn btn-sm btn-primary mr-1">Editer</NavLink>
						<button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
					</td>
				</tr>)}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onPageChanged={handlePageChange}
				length={filteredInvoices.length} />
		</>
	);
};

export default InvoicesPage;
