import * as React from "react";

import styled from "styled-components";

import { Dropdown } from 'semantic-ui-react'

const friendOptions = [
    {
      key: 'Jenny Hess',
      text: "a new game starts",
      value: 'Jenny Hess',
      image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
      key: 'Elliot Fu',
      text: "the game ends",
      value: 'Elliot Fu',
      image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
      key: 'Stevie Feliciano',
      text: "someone dies",
      value: 'Stevie Feliciano',
      image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
      key: 'Christian',
      text: "someone respawns",
      value: 'Christian',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
    {
      key: 'combo',
      text: "a combo occurs",
      value: 'combo',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
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
