import React from 'react';

const Field = (
	{ name, label, value, onChange, required, placeholder = "", type = "text", error = "" }
	) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<input
				value={value}
				onChange={onChange}
				type={type}
				placeholder={placeholder || label}
				name={name}
				id={name}
				required={required && 'required'}
				className={"form-control" + (error && " is-invalid")}
			/>
			{error && <p className="invalid-feedback">{error}</p>}
		</div>
	);
};

export default Field;
