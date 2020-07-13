import React from "react";
import styled from "@emotion/styled";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import { actionComponents } from "@/containers/actions";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { EventItem } from "./EventItem";
import { Action } from "@vinceau/event-actions";
import { ActionInput, AddActionInput } from "./ActionInputs";

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.foreground3};
  text-align: center;
  padding: 0.5rem 0;
  h2 {
    display: inline;
    margin-right: 1rem;
  }
`;

export const EventActionLists: React.FC = () => {
  const [selected, setSelected] = React.useState<number>(0);
  const val = useSelector((state: iRootState) => state.automator.events);
  const actions = useSelector((state: iRootState) => state.automator.actions);
  const dispatch = useDispatch<Dispatch>();
  const selectedActions = val[selected] ? actions[val[selected].id] || [] : [];
  const disabledActions = selectedActions.map((a) => a.name);
  const onActionChange = (index: number, action: Action) => {
    const eventId = val[selected].id;
    dispatch.automator.updateActionEvent({ eventId, index, action });
  };
  const onActionRemove = (index: number) => {
    const eventId = val[selected].id;
    dispatch.automator.removeActionEvent({ eventId, index });
  };
  const onActionAdd = (name: string) => {
    const eventId = val[selected].id;
    const params = actionComponents[name].defaultParams;
    const action = {
      name,
      args: params ? params() : {},
    };
    dispatch.automator.addNewEventAction({ eventId, action });
  };
  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement>
        <Header>
          <h2>Events</h2>
        </Header>
        <div>
          {val.map((e, i) => {
            return <EventItem key={e.id} selected={selected === i} onClick={() => setSelected(i)} event={e} />;
          })}
        </div>
      </ReflexElement>

      <ReflexSplitter />

      <ReflexElement>
        <Header>
          <h2>Actions</h2>
        </Header>
        <div>
          {selectedActions.map((a, i) => {
            const onInnerActionChange = (newVal: Action) => {
              onActionChange(i, newVal);
            };
            const prefix = i === 0 ? "Then " : "And ";
            return (
              <ActionInput
                key={`${val[selected].id}--${a.name}`}
                selectPrefix={prefix}
                value={a}
                onChange={onInnerActionChange}
                disabledActions={[]}
                onRemove={() => onActionRemove(i)}
              />
            );
          })}
          <AddActionInput onChange={onActionAdd} disabledActions={disabledActions} />
        </div>
      </ReflexElement>
    </ReflexContainer>
  );
};
