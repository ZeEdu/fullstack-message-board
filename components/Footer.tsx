import React from "react";
import styled from "styled-components";
import Container from "./Container";

const StyledFooter = styled.footer`
  height: 7.5rem;
`;

const Text = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  color: #2e3440;
  text-align: center;
  margin-top: 2rem;
`;

const Footer = () => {
  return (
    <Container>
      <StyledFooter>
        <Text>
          Alguns direitos reservados. Desenvolvido por José Eduardo Siqueira
          Carlos
        </Text>
      </StyledFooter>
    </Container>
  );
};

export default Footer;
