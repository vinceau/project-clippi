import React from "react";

import ReactMarkdown from "react-markdown";

import supporters from "raw-loader!../../../../SUPPORTERS.md";

export const InfoView: React.FC = () => {
    return (
        <div>
            <h2>App Info</h2>
            <ReactMarkdown
                source={supporters}
            />
        </div>
    );
};
