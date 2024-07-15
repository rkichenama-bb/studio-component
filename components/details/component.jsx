import React, { useState } from 'react';
import styled from 'styled-components';

const Details = styled.details`
    outline: 1px dashed;
    outline-offset: -1px;
`;
const Summary = styled.summary`
    display: grid;
    grid-template-columns: 1fr 32px;
`;
const Text = styled.div`
    ${Summary} & {
        font-weight: bold;
    }
`;
const Toggle = styled.button.attrs({
    children: '>',
})`
    margin: 0;
    padding: 0;
    background: none;
    outline: none;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default ({
	options: { startOpen, title, body },
}) => {
	const [open, setOpen] = useState(startOpen);
	return (
		<Details {...{ open }}>
            <Summary>
                <Text>{title}</Text>
                <Toggle onClick={() => setOpen((open) => !open)} />
            </Summary>
            <Text dangerouslySetInnerHTML={{ __html: body }} />
        </Details>
	);
};
