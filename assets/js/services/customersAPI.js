import axios from "axios";

function findAll() {
	return axios.get(`http://localhost:8000/api/customers?paginate=true&count=100`)
		.then(response => response.data['hydra:member']);
}

function deleteCustomer(id) {
	return axios.delete(`http://localhost:8000/api/customers/${id}`);
}

export default {
	findAll,
	delete: deleteCustomer()
}
