import * as React from 'react';

import { ComboForm } from './ComboForm';
import { getStatic } from '@/lib/utils';

export const SettingsPage: React.FC<{}> = props => {
    const imgSrc = getStatic('/images/bowser_default.png');
    return (
        <div>
            <img src={imgSrc} />
            <h1>Settings</h1>
            <ComboForm />
        </div>
    );
};
