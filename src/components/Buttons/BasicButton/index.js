import styled from "styled-components";

const BasicButton = styled.button`
  background-color: #00fb83;
  padding: ${({ p = "12px" }) => p};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #065630;
  font-weight: 700;
  font-size: ${({ fs = "14px" }) => fs};
  text-align: center;
  width: 100%;
  height: ${({ height = "auto" }) => height};
  box-sizing: border-box;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
  &:hover {
    background-color: ${({ disabled = false }) => (disabled ? "#00fb83" : "#29f563")};
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
