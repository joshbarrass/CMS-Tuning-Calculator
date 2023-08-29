import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import tuningParts from '../../modules/tuning-parts.json';
import { XLg } from 'react-bootstrap-icons';
import { compareBasedOnName } from '../../modules/common';
import { ClearSelectedPartsEvent, UpdateSelectedPartsEvent } from '../../modules/customEvents';
import CardComponent from './CardComponent';

const CompatiblePartsContainer = () => {

	const { currentEngine, selectedParts } = React.useContext(CalculatorContext);

	const onTuneChanged = ({target}) => {
		
		const partName = target.dataset.partName;
		const partQt = target.dataset.partQuantity;

		if (selectedParts.some(selectedPart => selectedPart.name === partName)) {
			dispatchEvent(new UpdateSelectedPartsEvent(selectedParts.filter(selectedPart => selectedPart.name !== partName)));
		}
		else {
			dispatchEvent(new UpdateSelectedPartsEvent([...selectedParts, { name: partName, quantity: partQt }].sort(compareBasedOnName)));
		}
	};

	return (
		<CardComponent title='Compatible Parts'>
			{
				currentEngine ?
					(
						<React.Fragment>
							<Table bordered striped='columns'>
								<thead>
									<tr>
										<th>Name</th>
										<th>Qt</th>
										<th>Boost</th>
										<th>Cost</th>
										<th>Cost / Boost</th>
										<th>Tune</th>
									</tr>
								</thead>
								<tbody>
									{
										currentEngine.compatibleParts.map(part => (
											<tr key={part.name}>
												<td>{part.name}</td>
												<td className='text-end'>{part.quantity}</td>
												<td className='text-end'>+{tuningParts[part.name]?.boost.toFixed(2)}%</td>
												<td className='text-end'>{tuningParts[part.name]?.cost} CR</td>
												<td className='text-end'>{tuningParts[part.name]?.costToBoost} CR/Boost</td>
												<td className='text-center'>
													<Form.Check
														aria-label='select to tune part'
														data-part-name={part.name}
														data-part-quantity={part.quantity}
														type='checkbox'
														checked={selectedParts.some(selectedPart => selectedPart.name === part.name)}
														onChange={onTuneChanged}
													/>
												</td>
											</tr>
										))
									}
								</tbody>
							</Table>
							<div className='text-end'>
								<Button aria-label='clear parts selection'
									disabled={!selectedParts.length}
									onClick={() => dispatchEvent(new ClearSelectedPartsEvent())}
								>
									<XLg className='mb-1' /> Clear
								</Button>
							</div>
						</React.Fragment>
					) :
					(
						<span>Select an engine to see its compatible parts.</span>
					)
			}
		</CardComponent>
	);
};

export default CompatiblePartsContainer;