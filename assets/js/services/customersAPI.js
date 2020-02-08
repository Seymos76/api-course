import axios from "axios";

function findAll() {
	return axios.get(`http://localhost:8000/api/customers?paginate=true&count=100`)
		.then(response => response.data['hydra:member']);
}

function deleteCustomer(id) {
	return axios.delete(`http://localhost:8000/api/customers/${id}`);
}

function findOne(id) {
	return axios
		.get('http://localhost:8000/api/customers/'+id)
		.then(response => response.data);
}

function update(id, customer) {
	return axios.put('http://localhost:8000/api/customers/'+id, customer);
}

function create(customer) {
	return axios.post('http://localhost:8000/api/customers', customer);
}

export default {
	findAll,
	delete: deleteCustomer,
	findOne,
	update,
	create
}
