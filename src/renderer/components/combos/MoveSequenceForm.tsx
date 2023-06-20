import { getMoveName, MoveId } from "@vinceau/slp-realtime";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Field } from "react-final-form";
import { Button, Dropdown, Icon } from "semantic-ui-react";

import { Labelled } from "../Labelled";

const moveOptions = [
  MoveId.NEUTRAL_AIR,
  MoveId.F_AIR,
  MoveId.B_AIR,
  MoveId.U_AIR,
  MoveId.D_AIR,
  MoveId.NEUTRAL_SPECIAL,
  MoveId.F_SPECIAL,
  MoveId.U_SPECIAL,
  MoveId.D_SPECIAL,
  MoveId.F_TILT,
  MoveId.U_TILT,
  MoveId.D_TILT,
  MoveId.F_SMASH,
  MoveId.U_SMASH,
  MoveId.D_SMASH,
  MoveId.F_THROW,
  MoveId.B_THROW,
  MoveId.U_THROW,
  MoveId.D_THROW,
  MoveId.GRAB_PUMMEL,
  MoveId.DASH_ATTACK,
  MoveId.JAB_1,
  MoveId.JAB_2,
  MoveId.JAB_3,
  MoveId.RAPID_JABS,
  MoveId.GETUP,
  MoveId.GETUP_SLOW,
  MoveId.EDGE,
  MoveId.EDGE_SLOW,
  MoveId.MISC,
].map((id) => ({
  key: id,
  value: id,
  text: `${getCustomMoveName(id)} [${id}]`,
}));

function getCustomMoveName(id: number) {
  switch (id) {
    case MoveId.JAB_1:
      return "Jab 1";
    case MoveId.JAB_2:
      return "Jab 2";
    case MoveId.JAB_3:
      return "Jab 3";
    default:
      return getMoveName(id);
  }
}

const MoveInput = ({
  value,
  onBlur,
  onChange,
  onRemove,
}: {
  value: number | undefined;
  onChange: (val: number) => void;
  onRemove: () => void;
  onBlur?: () => void;
}) => {
  const handleChange = React.useCallback(
    (_e, { value }) => {
      onChange(value);
    },
    [onChange]
  );
  return (
    <div style={{ display: "flex", paddingBottom: 10, alignItems: "center" }}>
      <div style={{ paddingLeft: 5, paddingRight: 10 }}>
        <Icon name="sort" />
      </div>
      <Dropdown
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        placeholder="Select move"
        fluid={true}
        search={true}
        selection={true}
        options={moveOptions}
      />
      <div style={{ marginLeft: 5 }}>
        <Labelled title="Remove">
          <Button type="button" icon={true} onClick={onRemove}>
            <Icon name="close" />
          </Button>
        </Labelled>
      </div>
    </div>
  );
};

type MoveSequenceFormProps = {
  value?: (number | undefined)[];
  onChange: (values: (number | undefined)[]) => void;
  onBlur?: () => void;
};

export const MoveSequenceForm = ({ value, onBlur, onChange }: MoveSequenceFormProps) => {
  const movesList = React.useMemo(() => {
    return value && value.length > 0 ? value : [undefined];
  }, [value]);

  const addNewMove = React.useCallback(() => {
    onChange([...movesList, undefined]);
  }, [onChange, movesList]);

  const updateValues = React.useCallback(
    (index: number, moveId: number) => {
      const newMoveValues = Array.from(movesList);
      newMoveValues[index] = moveId;
      onChange(newMoveValues);
    },
    [onChange, movesList]
  );

  const removeMove = React.useCallback(
    (index: number) => {
      const newMoveValues = Array.from(movesList);
      if (index > -1) {
        newMoveValues.splice(index, 1);
      }
      onChange(newMoveValues);
    },
    [onChange, movesList]
  );

  const onDragEnd = React.useCallback(
    ({ destination, source }: any) => {
      if (!destination) {
        return;
      }
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      const newMoveValues = Array.from(movesList);
      move(newMoveValues, source.index, destination.index);
      onChange(newMoveValues);
    },
    [onChange, movesList]
  );

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="move-sequence-form">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {movesList.map((moveId, i) => {
                const id = `index-${i}-move${moveId}`;
                return (
                  <Draggable key={id} draggableId={id} index={i}>
                    {(provided, _snapshot) => (
                      <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <MoveInput
                          value={moveId}
                          onChange={(num) => updateValues(i, num)}
                          onRemove={() => removeMove(i)}
                          onBlur={onBlur}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Button type="button" onClick={addNewMove}>
          <Icon name="plus" /> Add move
        </Button>
      </DragDropContext>
    </div>
  );
};

export const MoveSequenceFormAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <MoveSequenceForm {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
};

function move<T>(input: T[], from: number, to: number) {
  let numberOfDeletedElm = 1;
  const elm = input.splice(from, numberOfDeletedElm)[0];
  numberOfDeletedElm = 0;
  input.splice(to, numberOfDeletedElm, elm);
}
