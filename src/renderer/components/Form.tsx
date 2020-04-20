import styled from "styled-components";

export const PageHeader = styled.h1`
font-variant: all-small-caps;
margin-bottom: 10px;
`;

export const Label = styled.div`
&&& {
font-weight: 500;
font-size: 14px;
margin-bottom: 10px;
}
`;

export const Text = styled.p`
font-size: 12px;
margin-top: 10px;
opacity: 0.8;
`;

export const Field = styled.div<{
    border?: string;
}>`
padding-top: 20px;
padding-bottom: 20px;

${p => (p.border === "top" || p.border === "both") && `
border-top: solid 1px ${p.theme.foreground3};
`}

${p => (p.border === "bottom" || p.border === "both") && `
border-bottom: solid 1px ${p.theme.foreground3};
`}

`;
