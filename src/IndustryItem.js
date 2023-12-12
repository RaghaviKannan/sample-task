import React from "react";
import "./IndustryItem.css";

const IndustryItem = ({
  data,
  onCheckboxChange,
  onExpandToggle,
  onDragStart,
  movedToRight,
}) => {
  const { industryId, name, subIndustryList, expanded, checked } = data;

  const handleCheckboxChange = () => {
    onCheckboxChange(data);
  };

  const handleExpandToggle = () => {
    onExpandToggle(industryId, movedToRight);
  };

  return (
    <div
      className={`industry-item ${expanded ? "expanded" : ""} ${
        movedToRight ? "moved-to-right" : ""
      }`}
      draggable={true}
      onDragStart={onDragStart}
    >
      <div className="industry-info">
        {subIndustryList && (
          <>
            <div
              className={`expander ${expanded ? "green-bg" : ""}`}
              onClick={handleExpandToggle}
            >
              {expanded ? "-" : "+"}
            </div>
          </>
        )}

        <div className={`horizontal-connector`} />

        <div className={`checkbox ${checked ? "green-bg" : ""}`}>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className={checked && subIndustryList ? "green-bg" : ""}
            style={{
              backgroundColor: "black",
              ":hover": {
                backgroundColor: "lightgreen",
              },
            }}
          />
          <p style={{ marginLeft: "4px" }}>{name}</p>
        </div>
      </div>
      {subIndustryList && expanded && (
        <div className="sub-industries">
          {subIndustryList.map((subIndustry) => (
            <IndustryItem
              key={subIndustry.id}
              data={subIndustry}
              onCheckboxChange={onCheckboxChange}
              onExpandToggle={onExpandToggle}
              onDragStart={onDragStart}
              movedToRight={movedToRight}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IndustryItem;
