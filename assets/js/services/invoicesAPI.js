import axios from "axios";

function findAll() {
	return axios.get(`http://localhost:8000/api/invoices`)
		.then(response => response.data['hydra:member']);
}

export default {
	findAll
}
