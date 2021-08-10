/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const {
    showPrevLink,
    showNextLink,
    handlePrevClick,
    handleNextClick,
    loading,
  } = props;

  return (
    <div className="nav-link-container">
      <a
        href="#"
        className={`
				nav-link 
				${showPrevLink ? "show" : "hide"}
				${loading ? "greyed-out" : ""}
				`}
        onClick={handlePrevClick}
      >
        Prev
      </a>
      <a
        href="#"
        className={`
				nav-link
				${showNextLink ? "show" : "hide"}
				${loading ? "greyed-out" : ""}
				`}
        onClick={handleNextClick}
      >
        Next
      </a>
    </div>
  );
};
