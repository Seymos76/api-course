import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import axios from "axios";

const CustomersPage = (props) => {
	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState('');

	const fetchCustomers = async () => {
		try {
			const data = await CustomersAPI.findAll();
			setCustomers(data);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleDelete = async id => {
		console.log('customer:',id);
		const originalCustomers = [...customers];
		setCustomers(customers.filter(customer => customer.id !== id));
		try {
			await axios.delete(`http://localhost:8000/api/customers/${id}`);
		} catch (e) {
			setCustomers(originalCustomers)
		}
	};

	const handlePageChange = page => {
		setCurrentPage(page);
	};

	const handleSearch = ({currentTarget}) => {
		setSearch(currentTarget.value);
	};

	const itemsPerPage = 10;
	const filteredCustomers = customers.filter(c =>
		c.firstName.toLowerCase().includes(search.toLowerCase())
		|| c.lastName.toLowerCase().includes(search.toLowerCase())
		|| c.email.toLowerCase().includes(search.toLowerCase())
		|| (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
	);

	const paginatedCustomers = filteredCustomers.length > itemsPerPage ? Pagination.getData(
		filteredCustomers,
		currentPage,
		itemsPerPage
	) : filteredCustomers;

	return (
		<>
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des clients</h1>
				<NavLink to="/customers/new" className="btn btn-primary">Ajouter un client</NavLink>
			</div>

			<div className="form-group">
				<input onChange={handleSearch} value={search} type="search" className="form-control" placeholder="Rechercher..."/>
			</div>

			<table className="table table-hover">
				<thead>
				<tr>
					<th>Id</th>
					<th>Client</th>
					<th>Email</th>
					<th>Entreprise</th>
					<th className="text-center">Factures</th>
					<th className="text-center">Montant total</th>
					<th/>
				</tr>
				</thead>
				<tbody>
				{paginatedCustomers.map(customer => <tr key={customer.id}>
					<td>{customer.id}</td>
					<td><NavLink to={`/customers/${customer.id}`}>{customer.firstName} {customer.lastName}</NavLink></td>
					<td>{customer.email}</td>
					<td>{customer.company}</td>
					<td className="text-center">
						<span className="badge badge-primary">{customer.invoices.length}</span>
					</td>
					<td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
					<td>
						<button
							onClick={() => handleDelete(customer.id)}
							disabled={customer.invoices.length > 0}
							className="btn btn-danger"
						>Supprimer</button>
					</td>
				</tr>)}

				</tbody>
			</table>
			{itemsPerPage < filteredCustomers.length &&
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				length={filteredCustomers.length}
				onPageChanged={handlePageChange}
			/>
			}

		</>
	);
};

export default CustomersPage;
