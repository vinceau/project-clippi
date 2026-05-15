import React from "react";

export function ExternalLink(props: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {props.children}
    </a>
  );
}
