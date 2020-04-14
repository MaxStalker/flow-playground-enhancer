import React from "react";
import styled from "styled-components";

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
`;

export default (props) => {
  const { options, value, onChange } = props;
  return (
    <Select value={value} onChange={onChange}>
      {options.map((item) => {
        return <option value={item.value}>{item.label}</option>;
      })}
    </Select>
  );
};
