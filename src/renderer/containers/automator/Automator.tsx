import * as React from "react";
import styled from "@emotion/styled";

import { Icon } from "semantic-ui-react";
import { ActionEvent } from "@/lib/realtime";
import { AddEventDropdown, EventActions } from "./EventActions";

import { EventActionConfig } from "@/containers/actions";
import { Dispatch, iRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const Header = styled.div`
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.foreground3};
  text-align: center;
  padding: 0.5rem 0;
  h2 {
    display: inline;
    margin-right: 1rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  border: solid 0.1rem ${({ theme }) => theme.foreground3};
  border-radius: 0.5rem;
`;

const LeftColumn = styled.div`
  width: 50%;
  overflow: hidden;
  overflow-y: auto;
`;
const RightColumn = styled.div`
  border-left: solid 0.1rem ${({ theme }) => theme.foreground3};
  width: 50%;
  overflow: hidden;
  overflow-y: auto;
`;

export const Automator: React.FC = () => {
  const [selected, setSelected] = React.useState<number>(0);
  const val = useSelector((state: iRootState) => state.slippi.events);
  const dispatch = useDispatch<Dispatch>();
  const disabledEvents = val.map((e) => e.event);
  const addEvent = (event: ActionEvent) => {
    dispatch.slippi.addNewEventAction(event);
  };
  /*
  return (
    <div>
      {val.map((e, i) => {
        const onChange = (newVal: EventActionConfig) => {
          dispatch.slippi.updateActionEvent({
            index: i,
            event: newVal,
          });
        };
        const onRemove = () => {
          dispatch.slippi.removeActionEvent(i);
        };
        return (
          <EventActions
            key={e.event}
            disabledOptions={disabledEvents}
            value={e}
            onChange={onChange}
            onRemove={onRemove}
          />
        );
      })}
      <AddEventDropdown onChange={addEvent} disabledOptions={disabledEvents} />
    </div>
  );
  */

  return (
    <Container>
      <LeftColumn>
        <Header>
          <h2>Events</h2>
          <Icon name="flag outline" />
        </Header>
        <div>
          {val.map((e, i) => {
            return (
              <div key={e.event} onClick={() => setSelected(i)}>
                {e.event}
              </div>
            );
          })}
        </div>
      </LeftColumn>
      <RightColumn>
        <Header>
          <h2>Actions</h2>
          <Icon name="check square outline" />
        </Header>
        <div>
          {val[selected].actions.map((a, i) => {
            return <div key={`${val[selected].event}--${a.name}`}>{a.name}</div>;
          })}
        </div>
      </RightColumn>
    </Container>
  );
};
