import React, { useState } from 'react';
import styles from './styles';
import { useLocalVariables, useLocalVariable } from 'bbstudio/hooks';

export default ({
	options: { localVariableName },
}) => {
	const [showLocalVariables, setShowLocalVariables] = useState(false);
	const allLocalVariables = useLocalVariables();
	const [counterValue, setCounterValue] = useLocalVariable(localVariableName, '0');
	const counterValueInt = parseInt(counterValue) || 0
	const counterValueText = counterValueInt.toString();

	const incrementCounter = () => {
		const nextInt = counterValueInt + 1;
		setCounterValue(nextInt.toString());
	}

	const decrementCounter = () => {
		const nextInt = counterValueInt - 1;
		setCounterValue(nextInt.toString());
	}

	const toggleShowLocalVariables = () => {
		setShowLocalVariables(!showLocalVariables);
	}

	return (
		<>
			<div
				className={styles.wrapper}
			>
				<button
					type="button"
					className={styles.button}
					onClick={decrementCounter}
				>
					Decrement
				</button>
				<span>
					Counter value: {counterValueText}
				</span>
				<button
					type="button"
					className={styles.button}
					onClick={incrementCounter}
				>
					Increment
				</button>
			</div>
			<div
				className={styles.wrapper}
			>
				{showLocalVariables ? (
					<button
						type="button"
						className={styles.button}
						onClick={toggleShowLocalVariables}
					>
						Hide all local variables
					</button>
				) : (
					<button
						type="button"
						className={styles.button}
						onClick={toggleShowLocalVariables}
					>
						Show all local variables
					</button>
				)}
			</div>
			{showLocalVariables && (
				<pre>
					{JSON.stringify(allLocalVariables, null, 2)}
				</pre>
			)}
		</>
	);
};
