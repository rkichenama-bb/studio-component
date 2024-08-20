import React from 'react';

export default ({
	options: { body: __html },
}) => (
    <div className="bb-internal-html-preformat" dangerouslySetInnerHTML={{ __html }} />
);
