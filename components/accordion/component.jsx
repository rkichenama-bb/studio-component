import React, { useState } from 'react';
import styles from './styles';
import chevron from './chevron.svg';

export default ({
	options: { startOpen, title },
	renderChildren,
}) => {
	const [open, setOpen] = useState(startOpen);

	const buttonModifiers = open ? ' ' + styles.shadow : '';

	return (
		<div>
			<button className={styles.button + buttonModifiers} onClick={() => setOpen(!open)}>
				<div>{title}</div>
				<img src={chevron} alt="Chevron pointing down" />
			</button>
			{
				open
					? (
						<div className={styles.content}>
							{renderChildren()}
						</div>
					)
					: null
			}
		</div>
	);
};
