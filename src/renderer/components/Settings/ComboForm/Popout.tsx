import * as React from "react";

import Select from 'react-select';
import Button from '@atlaskit/button';
import produce from "immer";

const colors = {
    neutral20: "#CCCCCC",
}

const selectStyles = {
    control: (provided: any) => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

const stateOptions = [
    { value: 'AL', label: 'Alabama'},
    { value: 'AK', label: 'Aksomething', isDisabled: true },
    { value: 'AB', label: 'be cool' },
    { value: 'CD', label: 'change dir', isDisabled: true},
    { value: 'DE', label: 'deuschland' },
    { value: 'FG', label: 'foreground' },
];

export const Popout = (props: any) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<any>(undefined);
    const [percent, setPercent] = React.useState<string>("");

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    const onSelectChange = (value: any) => {
        toggleOpen();
        setValue(value);
    };
    const handleOnChange = () => {
        console.log(`old props: ${JSON.stringify(props.value)}`);
        console.log("clicking add");
        console.log(`setting ${value.value} to ${percent}`);
        const newValue = produce(props.input.value || {}, (draft: any) => {
            draft[value.value] = percent;
        });
        console.log(`setting ${value.value} to ${percent}`);
        console.log(`new props: ${JSON.stringify(newValue)}`);
        props.input.onChange(newValue);
    };

    return (
        <>
        <Dropdown
            isOpen={isOpen}
            onClose={toggleOpen}
            target={
                <Button
                    iconAfter={<ChevronDown />}
                    onClick={toggleOpen}
                    isSelected={isOpen}
                >
                    {value ? `State: ${value.label}` : 'Select a State'}
                </Button>
            }
        >
            <Select
                autoFocus
                backspaceRemovesValue={false}
                components={{ DropdownIndicator, IndicatorSeparator: null }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                menuIsOpen={true}
                onChange={onSelectChange}
                options={stateOptions}
                placeholder="Search..."
                styles={selectStyles}
                tabSelectsValue={false}
                value={value}
            />
        </Dropdown>
        <input type="text" value={percent} onChange={e => setPercent(e.target.value)}/>
            <pre>{JSON.stringify(value)}</pre>
            <pre>{percent}</pre>
            <button onClick={handleOnChange}>Add</button>
            <div>
                {props.input.value && Object.entries(props.input.value).map(([k, v]) => {
                    return (<p key={`input--value--${k}--${v}`}>{k}: {v}</p>);
                })}
            </div>
        </>
    );
};

// styled components

const Menu = (props: any) => {
    const shadow = 'hsla(218, 50%, 10%, 0.1)';
    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
                marginTop: 8,
                position: 'absolute',
                zIndex: 2,
            }}
            {...props}
        />
    );
};
const Blanket = (props: any) => (
    <div
        style={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1,
        }}
        {...props}
    />
);
const Dropdown = ({ children, isOpen, target, onClose }: any) => (
    <div style={{ position: 'relative' }}>
        {target}
        {isOpen ? <Menu>{children}</Menu> : null}
        {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
);
const Svg = (p: any) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);
const ChevronDown = () => (
    <Svg style={{ marginRight: -6 }}>
        <path
            d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </Svg>
);
