interface ContextDescriptions {
    category: string;
    descriptions: Array<{
        contextName: string,
        description: string,
    }>;
}

export const contextDescriptions: ContextDescriptions[] = [
    {
        category: "Date",
        descriptions: [
            {contextName: "date", description: "Locally formatted date"},
            {contextName: "YYYY", description: "Full year e.g. 2019"},
            {contextName: "YY", description: "Short year e.g. 19"},
            {contextName: "MM", description: "Numerical month e.g. 01"},
            {contextName: "MMM", description: "Short month e.g. Jan"},
            {contextName: "MMMM", description: "Full month e.g. January"},
            {contextName: "DD", description: "Numerical day e.g. 18"},
            {contextName: "ddd", description: "Short weekday e.g. Sat"},
            {contextName: "dddd", description: "Full weekday e.g. Saturday"},
        ],
    },
    {
        category: "Time",
        descriptions: [
            {contextName: "time", description: "Locally formatted time"},
            {contextName: "HH", description: "Hour in 24hr time e.g. 17"},
            {contextName: "hh", description: "Hour in 12hr time e.g. 5"},
            {contextName: "mm", description: "Minutes e.g. 33"},
            {contextName: "ss", description: "Seconds e.g. 54"},
            {contextName: "a", description: "Lower-case AM/PM e.g. pm"},
            {contextName: "A", description: "Upper-case AM/PM e.g. PM"},
        ],
    },
    {
        category: "Filename",
        descriptions: [
            {contextName: "filename", description: "Name portion of the original filename e.g. Game_1234"},
            {contextName: "fileExt", description: "Extension portion of the original filename e.g. .slp"},
            {contextName: "fullFilename", description: "Full original filename including extension e.g. Game_1234.slp"},
        ],
    },
    {
        category: "Game Info",
        descriptions: [
            {contextName: "numPlayers", description: "Number of players e.g. 2"},
            {contextName: "stage", description: "Full name of stage e.g. Fountain of Dreams"},
            {contextName: "shortStage", description: "Shortened name of stage e.g. FoD"},
        ],
    },
    {
        category: "Game Info (2P)",
        descriptions: [
            {contextName: "playerTag", description: "Nametag of player e.g. BORT"},
            {contextName: "playerPort", description: "Port of player e.g. 3"},
            {contextName: "playerChar", description: "Name of player character e.g. Captain Falcon"},
            {contextName: "playerShortChar", description: "Shortened name of player character e.g. Falcon"},
            {contextName: "playerColor", description: "Color of player character e.g. White"},
            {contextName: "opponentTag", description: "Nametag of opponent e.g. YORT"},
            {contextName: "opponentPort", description: "Port of opponent e.g. 1"},
            {contextName: "opponentChar", description: "Name of opponent character e.g. Ganondorf"},
            {contextName: "opponentShortChar", description: "Shortened name of opponent character e.g. Ganon"},
            {contextName: "opponentColor", description: "Color of opponent character e.g. Default"},
        ],
    },
];
