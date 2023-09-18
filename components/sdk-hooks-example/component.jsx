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
	const [deviceCounterValue, setDeviceCounterValue] = useLocalVariable(localVariableName, '0');
	const [showInteractionData, setShowInteractionData] = useState(true);
	const { isLoading, isError, interaction } = useInteraction();
	const deviceCounterValueInt = parseInt(deviceCounterValue) || 0
	const deviceCounterValueText = deviceCounterValueInt.toString();
	const tagCounterValueInt = parseInt(interaction?.object?.variables.counter) || 0
	const tagCounterValueText = tagCounterValueInt.toString();

	const incrementDeviceCounter = () => {
		const nextInt = deviceCounterValueInt + 1;
		setDeviceCounterValue(nextInt.toString());
	}

	const decrementDeviceCounter = () => {
		const nextInt = deviceCounterValueInt - 1;
		setDeviceCounterValue(nextInt.toString());
	}

	const incrementTagCounter = async () => {
		const nextInt = tagCounterValueInt + 1;
		await interaction.object.setObjectVariables({
			counter: nextInt.toString(),
		});
	}

	const decrementTagCounter = async () => {
		const nextInt = tagCounterValueInt - 1;
		await interaction.object.setObjectVariables({
			counter: nextInt.toString(),
		});
	}

	const toggleShowLocalVariables = () => {
		setShowLocalVariables(!showLocalVariables);
	}

	const toggleShowInteractionData = () => {
		setShowInteractionData(!showInteractionData);
	}

	return (
		<>
			<h2>Local Variables</h2>
			<div
				className={styles.wrapper}
			>
				<button
					type="button"
					className={styles.button}
					onClick={decrementDeviceCounter}
				>
					Decrement
				</button>
				<span>
					Counter value: {deviceCounterValueText}
				</span>
				<button
					type="button"
					className={styles.button}
					onClick={incrementDeviceCounter}
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
			<h2>Object Variables</h2>
			<div
				className={styles.wrapper}
			>
				<button
					type="button"
					className={styles.button}
					onClick={decrementTagCounter}
				>
					Decrement
				</button>
				<span>
					Counter value: {tagCounterValueText}
				</span>
				<button
					type="button"
					className={styles.button}
					onClick={incrementTagCounter}
				>
					Increment
				</button>
			</div>
			<div
				className={styles.wrapper}
			>
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
