import React from "react";
import { FC } from "react";
import styled, { css } from "styled-components";

interface ButtonStyledProps {
  expand?: boolean;
}

const StyledButton = styled("button")<ButtonStyledProps>`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #3b4252;
  background-color: #88c0d0;
  padding: 1rem;
  border: 2px solid #88c0d0;
  border-radius: 0.3125rem;
  transition: 0.3s ease-in;
  &:focus,
  &:hover {
    outline: none;
    box-shadow: 0 0 0 3px #3b4252;
  }
  ${({ expand }) =>
    expand &&
    css`
      width: 100%;
    `}
`;

interface ButtonProps {
  value: string;
  onClickAction?: () => Promise<void> | void;
  disabled?: boolean;
  type: "button" | "submit" | "reset";
  expand?: boolean;
}

const Button: FC<ButtonProps> = ({
  value,
  onClickAction,
  disabled = false,
  type,
  expand = false,
}) => (
  <StyledButton
    type={type}
    onClick={onClickAction}
    disabled={disabled}
    expand={expand}
  >
    {value}
  </StyledButton>
);

export default Button;
