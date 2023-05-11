import React, { useState } from 'react';
import styles from './styles';
import testI from './testI.jpeg';

export default ({
	options: { startOpen },
	renderChildren,
}) => {
	const [open, setOpen] = useState(startOpen);

	return (
		<div>
			<img className={styles.image} src={testI} />
			<button className={styles.button} onClick={() => setOpen(!open)}>
				{open ? 'Close' : 'Open'}
			</button>
			<div>
			{
				open
					? renderChildren()
					: null
			}
			</div>
		</div>
	);
};
