import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
import * as LocalRenderer from '@getflywheel/local/renderer';

// https://github.com/getflywheel/local-components
import { Button, FlyModal, Title, Text } from '@getflywheel/local-components';

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			siteId: props.match.params.siteID,
			showInstructions: false,
		};

		this.hideInstructions = this.hideInstructions.bind(this);
		this.switchToEuro = this.switchToEuro.bind(this);
		this.switchToUS = this.switchToUS.bind(this);
		this.switchToAus = this.switchToAus.bind(this);
		this.switchToCanada = this.switchToCanada.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on('instructions', (event) => {
			this.setState({
				showInstructions: true,
			});
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners('instructions');
	}

	hideInstructions() {
		this.setState({
			showInstructions: false,
		});
	}

	switchToEuro() {
		ipcRenderer.send(
			'switch-country',
			this.state.siteId,
			'Brederopad 77',
			'',
			'Delft',
			'NL',
			'2624 XR',
			'EUR',
			' ',
			',',
			'kg',
			'cm',
		);
	}
	
	switchToAus() {
		ipcRenderer.send(
			'switch-country',
			this.state.siteId,
			'28 Kaesler Road',
			'',
			'Mount Burr',
			'AU:SA',
			'5279',
			'AUD',
			' ',
			',',
			'kg',
			'cm',
		);
	}	
	
	switchToCanada() {
		ipcRenderer.send(
			'switch-country',
			this.state.siteId,
			'40 Bay St',
			'',
			'Toronto',
			'CA:ON',
			'M5J 2X2',
			'CAD',
			' ',
			',',
			'kg',
			'cm',
		);
	}	
	
	switchToUS() {
		ipcRenderer.send(
			'switch-country',
			this.state.siteId,
			'537 Paper Street',
			'#34',
			'Wilmington',
			'US:DE',
			'19806',
			'USD',
			',',
			'.',
			'lbs',
			'in',
		);
	}

	renderInstructions() {
		return (
			<FlyModal
				isOpen={this.state.showInstructions}
				onRequestClose={this.hideInstructions}
			>
				<Title fontSize='xl'>Great Success!</Title>
				<div style={{padding: '20px'}}>
					<Text
						fontSize='l'
						privateOptions={{
							fontWeight: 'medium',
						}}
					>
						Site locale switcheroo happened without incident!
					</Text>
				</div>
			</FlyModal>
		)
	}

    render() {
        return (
            <div style={{ flex: '1', overflowY: 'auto', margin: '10px' }}>
				{this.renderInstructions()}
				<div>
					<Button onClick={this.switchToUS}>Switch Site to US</Button>
					<Button onClick={this.switchToEuro}>Switch Site to Europe</Button>
					<Button onClick={this.switchToAus}>Switch Site to Australia</Button>
					<Button onClick={this.switchToCanada}>Switch Site to Canada</Button>
				</div>
            </div>
        )
    }

}
