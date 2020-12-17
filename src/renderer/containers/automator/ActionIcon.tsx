import React from "react";
import { Icon } from "semantic-ui-react";
import { actionComponents } from "@/containers/actions";

/**
 * Listens to the outer ref element for hover events. Returns the remove icon if currently hovering.
 * Otherwise returns the specified action icon. We define it like this instead of having a hover state
 * in the parent because it causes the entire tree to re-render when the hover state in the parent changes.
 */
export const ActionIcon = React.memo<{ name: string; outer: React.RefObject<HTMLElement> }>(({ name, outer }) => {
  const [hover, setHover] = React.useState(false);
  const onMouseEnter = React.useCallback(() => setHover(true), [setHover]);
  const onMouseLeave = React.useCallback(() => setHover(false), [setHover]);

  // Listen to mouse events on the outer element
  React.useEffect(() => {
    if (outer.current) {
      outer.current.addEventListener("mouseenter", onMouseEnter);
      outer.current.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      if (outer.current) {
        outer.current.removeEventListener("mouseenter", onMouseEnter);
        outer.current.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [outer]);

  if (!actionComponents[name]) {
    return null;
  }

  if (hover) {
    return <Icon name="close" size="large" />;
  }

  const CompIcon = actionComponents[name].Icon;
  return <CompIcon />;
});
