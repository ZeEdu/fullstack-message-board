import React from "react";
import PropTypes from "prop-types";

const Input = ({ label, type, name, register, errors }) => {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        <input id={name} type={type} name={name} {...register} />
      </label>
      {errors && <span>{errors.message}</span>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([
    "datetime-local",
    "button",
    "checkbox",
    "color",
    "date",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ]),
  name: PropTypes.string,
  register: PropTypes.any,
  errors: PropTypes.any,
};

export default Input;
