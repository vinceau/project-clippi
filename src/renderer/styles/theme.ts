export interface Theme {
    body: string;
    text: string;
    secondary: string;
    toggleBorder: string;
    gradient: string;
    background: string;
    background2: string;
}

export const lightTheme: Theme = {
    body: "#E2E2E2",
    text: "#363537",
    toggleBorder: "#FFF",
    secondary: "#FFF",
    gradient: "linear-gradient(#39598A, #79D7ED)",
    background: "#FFF",
    background2: "#FFF",
};

export const darkTheme: Theme = {
    body: "#363537",
    text: "#FAFAFA",
    secondary: "#111329",
    toggleBorder: "#6B8096",
    gradient: "linear-gradient(#091236, #1E215D)",
    background: "#22222C",
    background2: "#1C1D30",
};
