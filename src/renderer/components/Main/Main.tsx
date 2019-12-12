import * as React from 'react';
import { SlippiConnect } from '../SlippiConnect/SlippiConnect';
import { TwitchConnect } from '../TwitchConnect/TwitchConnect';

export const Main: React.FC<{}> = () => {
    return (
        <div>
            <TwitchConnect />
            <SlippiConnect />
        </div>
    );
};
