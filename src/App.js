import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import IndustryItem from "./IndustryItem";
import data from "./SampleData.json";
import "./App.css";

const App = () => {
  const [leftItems, setLeftItems] = useState(
    data.map((item, index) => ({ ...item, originalOrder: index }))
  );
  const [rightItems, setRightItems] = useState([]);
  const [includeSubIndustries, setIncludeSubIndustries] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckboxChange = (item) => {
    const updatedItem = { ...item, checked: !item.checked };

    if (updatedItem.checked) {
      setLeftItems((prevLeftItems) =>
        prevLeftItems.filter((i) => i.industryId !== updatedItem.industryId)
      );
      setRightItems((prevRightItems) => [...prevRightItems, updatedItem]);
    } else {
      setRightItems((prevRightItems) =>
        prevRightItems.filter((i) => i.industryId !== updatedItem.industryId)
      );
      setLeftItems((prevLeftItems) => {
        const originalOrder = item.originalOrder;
        const leftBefore = prevLeftItems.slice(0, originalOrder);
        const leftAfter = prevLeftItems.slice(originalOrder);
        return [...leftBefore, updatedItem, ...leftAfter];
      });
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropLeft = () => {
    if (draggedItem) {
      const updatedItem = { ...draggedItem, checked: false };

      setRightItems((prevRightItems) =>
        prevRightItems.filter((i) => i.industryId !== updatedItem.industryId)
      );

      const originalOrder = draggedItem.originalOrder;
      setLeftItems((prevLeftItems) => {
        const leftBefore = prevLeftItems.slice(0, originalOrder);
        const leftAfter = prevLeftItems.slice(originalOrder);
        return [...leftBefore, updatedItem, ...leftAfter];
      });
    }

    setDraggedItem(null);
  };

  const handleDropRight = () => {
    if (draggedItem) {
      const updatedItem = { ...draggedItem, checked: true };

      setLeftItems((prevLeftItems) =>
        prevLeftItems.filter((i) => i.industryId !== updatedItem.industryId)
      );

      setRightItems((prevRightItems) => [
        ...prevRightItems,
        { ...updatedItem, originalOrder: draggedItem.originalOrder },
      ]);
    }

    setDraggedItem(null);
  };

  const handleExpandToggle = (industryId, isRightColumn) => {
    if (isRightColumn) {
      setRightItems((prevRightItems) =>
        prevRightItems.map((item) =>
          item.industryId === industryId
            ? { ...item, expanded: !item.expanded }
            : item
        )
      );
    } else {
      setLeftItems((prevLeftItems) =>
        prevLeftItems.map((item) =>
          item.industryId === industryId
            ? { ...item, expanded: !item.expanded }
            : item
        )
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLeftItems = leftItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h3 style={{ fontSize: "16px" }}>Industries</h3>
      <div className="App">
        <div className="column">
          <div className="heading">
            <p>Choose from</p>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ border: "none", outline: "none" }}
              />
            </div>
          </div>

          <div
            className="content"
            onDragOver={handleDragOver}
            onDrop={handleDropLeft}
          >
            {filteredLeftItems.map((item) => (
              <IndustryItem
                key={item.industryId}
                data={item}
                onCheckboxChange={handleCheckboxChange}
                onExpandToggle={handleExpandToggle}
                onDragStart={() => handleDragStart(item)}
              />
            ))}
          </div>
        </div>
        <div
          className="icon-column"
          style={{ display: "flex", alignSelf: "center", color: "gray" }}
        >
          <FontAwesomeIcon icon={faExchangeAlt} size="2x" />
        </div>
        <div className="column">
          <div className="heading">
            <p>Selected</p>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={includeSubIndustries}
                  onChange={() =>
                    setIncludeSubIndustries((prevInclude) => !prevInclude)
                  }
                />
                Include Sub-Industries
              </label>
            </div>
          </div>
          <div
            className="content"
            onDragOver={handleDragOver}
            onDrop={handleDropRight}
          >
            {rightItems.map((item) => (
              <IndustryItem
                key={item.industryId}
                data={item}
                onCheckboxChange={handleCheckboxChange}
                onExpandToggle={(industryId) =>
                  handleExpandToggle(industryId, true)
                }
                onDragStart={() => handleDragStart(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
