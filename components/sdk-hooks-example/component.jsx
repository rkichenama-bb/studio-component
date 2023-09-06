import React, { useState } from 'react';
import styles from './styles';
import {
	useLocalVariables,
	useLocalVariable,
	useInteraction,
} from 'bbstudio/hooks';

export default ({
	options: { localVariableName },
}) => {
	const [showLocalVariables, setShowLocalVariables] = useState(false);
	const allLocalVariables = useLocalVariables();
	const [counterValue, setCounterValue] = useLocalVariable(localVariableName, '0');
	const [showInteractionData, setShowInteractionData] = useState(false);
	const { isLoading, isError, interaction } = useInteraction();
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

	const toggleShowInteractionData = () => {
		setShowInteractionData(!showInteractionData);
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
				{showInteractionData ? (
					<button
						type="button"
						className={styles.button}
						onClick={toggleShowInteractionData}
					>
						Hide interaction data
					</button>
				) : (
					<button
						type="button"
						className={styles.button}
						onClick={toggleShowInteractionData}
					>
						Show interaction data
					</button>
				)}
			</div>
			{showLocalVariables && (
				<pre>
					{JSON.stringify(allLocalVariables, null, 2)}
				</pre>
			)}
			{showInteractionData && (
				<InteractionData
					isLoading={isLoading}
					isError={isError}
					interaction={interaction}
				/>
			)}
		</>
	);
};

const InteractionData = ({
	isLoading,
	isError,
	interaction,
}) => {
	if (isLoading) {
		return <div>Loading...</div>
	}
	if (isError) {
		return <div>There was an error loading interaction data.</div>
	}
	return (
		<pre>
			{JSON.stringify(interaction, null, 2)}
		</pre>
	);
};
