import React from "react";
export const Switch = props => {
  const { active, onClick, label } = props;
  const dotClasss = active ? "switch-dot switch-dot--active" : "switch-dot";
  return (
    <div className="switch-container" onClick={onClick}>
      <div className="switch-control">
        <div className={dotClasss} />
      </div>
      <div className="switch-label">{label}</div>
    </div>
  );
};
