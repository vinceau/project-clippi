import React from "react";

import { Dispatch } from "@/store";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export const History: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const history = useHistory();

  React.useEffect(() => {
    const unsubscribe = history.listen((location) => {
      const pathname = location.pathname;
      const page = pathname.split("/")[1];
      dispatch.tempContainer.setLatestPath({
        page,
        pathname,
      });
      console.log(`page: ${page}, pathname: ${pathname}`);
    });
    return () => unsubscribe();
  }, []);

  return null;
};
