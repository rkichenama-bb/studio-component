import React, { useState } from 'react';
import styles from './styles';

export default ({
	options: { startOpen },
	renderChildren,
}) => {
	const [open, setOpen] = useState(startOpen);

	return (
		<div>
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
