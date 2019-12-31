import * as React from "react";

import styled from "styled-components";

import { Dropdown } from 'semantic-ui-react'

const friendOptions = [
    {
      key: 'Jenny Hess',
      text: "a new game starts",
      value: 'Jenny Hess',
    },
    {
      key: 'Elliot Fu',
      text: "the game ends",
      value: 'Elliot Fu',
    },
    {
      key: 'Stevie Feliciano',
      text: "someone dies",
      value: 'Stevie Feliciano',
    },
    {
      key: 'Christian',
      text: "someone respawns",
      value: 'Christian',
    },
    {
      key: 'combo',
      text: "a combo occurs",
      value: 'combo',
    },
  ];

export const EventActions = () => {
    const Outer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `;
    return (
        <Outer>
  <span>
    When {" "}
    <Dropdown
      inline
      options={friendOptions}
      defaultValue={friendOptions[0].value}
    />
  </span>
        </Outer>
    );
};
