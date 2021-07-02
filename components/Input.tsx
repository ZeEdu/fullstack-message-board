import React, { FC } from "react";

import { DeepMap, FieldError, FieldValues } from "react-hook-form";
import styled, { css } from "styled-components";

interface InputProps {
  label: string;
  id: string;
  type:
    | "datetime-local"
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  name: string;
  register: any;
  errors: DeepMap<FieldValues, FieldError>;
}

const Typography = css`
  font-family: "Roboto", sans-serif;
  color: #3b4252;
  font-size: 1rem;
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledLabel = styled.label`
  ${Typography}
  display: block;
`;
const StyledInput = styled.input`
  ${Typography}
  border: 1px solid #2e3440;
  display: block;
  width: 100%;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 0.3125rem;
  transition: 0.2s;
  margin-top: 12px;
  ::placeholder {
    color: #d8dee9;
  }
  &:focus,
  &:hover {
    outline: none;
    box-shadow: 0 0 0 3px #88c0d0;
  }
`;
const ErrorMessage = styled.p``;

const Input: FC<InputProps> = ({ label, type, name, register, errors }) => {
  return (
    <Wrapper>
      <StyledLabel htmlFor={name}>
        {label}
        <StyledInput id={name} type={type} name={name} {...register} />
      </StyledLabel>
      {errors && <ErrorMessage>{errors.message}</ErrorMessage>}
    </Wrapper>
  );
};

export default Input;
