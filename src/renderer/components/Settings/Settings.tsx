import * as React from 'react';

import { ComboForm } from './ComboForm';

export const SettingsPage: React.FC<{}> = props => {
    return (
        <div>
            <h1>Settings</h1>
            <ComboForm />
        </div>
    );
};
