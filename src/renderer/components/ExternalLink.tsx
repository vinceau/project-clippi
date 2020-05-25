import React from "react";

export const A: React.FC<React.HTMLProps<HTMLAnchorElement>> = (props) => {
  return (
    <a target="_blank" rel="noreferrer" {...props}>
      {props.children}
    </a>
  );
};
