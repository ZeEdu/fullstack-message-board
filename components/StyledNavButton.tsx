import React, { FC } from "react";
import styled from "styled-components";

const Button = styled.button`
  background: white;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  color: #2e3440;
  padding: 0.75rem;
  border: 3px solid white;
  border-radius: 0.3125rem;
  transition: 0.3s;
  &:hover,
  &:focus {
    border-color: #88c0d0;
    color: #88c0d0;
  }
`;

interface StyledNavButtonProps {
  value: string;
  onClick: () => void;
}

const StyledNavButton: FC<StyledNavButtonProps> = ({ value, onClick }) => {
  return (
    <Button type="button" onClick={onClick}>
      {value}
    </Button>
  );
};

export default StyledNavButton;
