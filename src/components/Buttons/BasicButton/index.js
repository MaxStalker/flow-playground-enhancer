import styled from "styled-components";

const BasicButton = styled.button`
  background-color: #00fb83;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #065630;
  font-weight: 700;
  font-size: 14px;
  width: 100%;
  text-align: center;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
  &:hover {
    background-color: ${({ disabled = false }) =>
      disabled ? "#00fb83" : "#29f563"};
  }
`;

export const GreenButton = styled(BasicButton)``;
export const GreyButton = styled(BasicButton)`
  background-color: #ddd;
  color: #222;

  &:hover {
    color: #222222;
    background-color: ${({ disabled = false }) => (disabled ? "#ddd" : "#ccc")};
  }
`;
