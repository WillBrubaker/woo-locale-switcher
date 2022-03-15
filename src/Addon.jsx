import React, { Component } from "react";
import { ipcRenderer } from "electron";
const { exec } = require("child_process");

// https://getflywheel.github.io/local-addon-api/modules/_local_renderer_.html
import * as LocalRenderer from "@getflywheel/local/renderer";

// https://github.com/getflywheel/local-components
import {
	Button,
	FlyModal,
	Title,
	Text,
	Tooltip,
} from "@getflywheel/local-components";

export default class Boilerplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			siteId: props.match.params.siteID,
			showInstructions: false,
			showError: false,
			localeSwitchedTo: "",
		};

		this.hideInstructions = this.hideInstructions.bind(this);
		this.hideError = this.hideError.bind(this);
		this.testRequest = this.testRequest.bind(this);
		this.launchPostman = this.launchPostman.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on("instructions", (event) => {
			this.setState({
				showInstructions: true,
			});
		});

		ipcRenderer.on("error", (event) => {
			this.setState({
				showError: true,
			});
		});
	}

	componentWillUnmount() {
		ipcRenderer.removeAllListeners("instructions");
	}

	hideInstructions() {
		this.setState({
			showInstructions: false,
		});
	}

	hideError() {
		this.setState({
			showError: false,
		});
	}

	switchCountry(newLocale, optionsToSet) {
		ipcRenderer.send("switch-country", this.state.siteId, optionsToSet);
		this.localeSwitchedTo = newLocale;
	}

	testRequest() {
		ipcRenderer.send("test-request");
	}

	launchPostman() {
		exec("open -a Postman");
	}

	renderInstructions() {
		return (
			<FlyModal
				isOpen={this.state.showInstructions}
				onRequestClose={this.hideInstructions}
			>
				<Title fontSize="xl">Great Success!</Title>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						Site locale switcheroo to {this.localeSwitchedTo}{" "}
						happened without incident!
					</Text>
				</div>
			</FlyModal>
		);
	}

	renderError() {
		return (
			<FlyModal
				isOpen={this.state.showError}
				onRequestClose={this.hideError}
			>
				<Title fontSize="xl">Much Sadness :(</Title>
				<div style={{ padding: "20px" }}>
					<Text
						fontSize="l"
						privateOptions={{
							fontWeight: "medium",
						}}
					>
						There was some sort of an error. Check the logs maybe.
					</Text>
				</div>
			</FlyModal>
		);
	}

	render() {
		return (
			<div style={{ flex: "1", overflowY: "auto", margin: "10px" }}>
				{this.renderInstructions()}
				{this.renderError()}
				<div>
					<ul style={{ listStyle: "none" }}>
						<li>
							<Button
								onClick={this.switchCountry.bind(
									this,
									"United States",
									{
										woocommerce_store_address: "537 Paper Street",
										woocommerce_store_address_2: "#34",
										woocommerce_store_city: "Wilmington",
										woocommerce_default_country: "US:DE",
										woocommerce_store_postcode: "19806",
										woocommerce_currency: "USD",
										woocommerce_price_thousand_sep: ",",
										woocommerce_price_decimal_sep: ".",
										woocommerce_weight_unit: "lbs",
										woocommerce_dimension_unit: "in",
									}
								)}
								className="woo button"
							>
								Switch Site to United States
							</Button>
						</li>
						<li>
							<Button
								onClick={this.switchCountry.bind(
									this,
									"Europe",
									{
										woocommerce_store_address: "Brederopad 77",
										woocommerce_store_address_2: "",
										woocommerce_store_city: "Delft",
										woocommerce_default_country: "NL",
										woocommerce_store_postcode: "2624 XR",
										woocommerce_currency: "EUR",
										woocommerce_price_thousand_sep: " ",
										woocommerce_price_decimal_sep: ",",
										woocommerce_weight_unit: "kg",
										woocommerce_dimension_unit: "cm",
									}
								)}
								className="woo button"
							>
								Switch Site to Europe
							</Button>
						</li>
						<li>
							<Button
								onClick={this.switchCountry.bind(
									this,
									"Australia",
									{
										woocommerce_store_address: "28 Kaesler Road",
										woocommerce_store_address_2: "",
										woocommerce_store_city: "Mount Burr",
										woocommerce_default_country: "AU:SA",
										woocommerce_store_postcode: "5279",
										woocommerce_currency: "AUD",
										woocommerce_price_thousand_sep: " ",
										woocommerce_price_decimal_sep: ",",
										woocommerce_weight_unit: "kg",
										woocommerce_dimension_unit: "cm",
										woocommerce_dimension_unit: "in",
									}
								)}
								className="woo button"
							>
								Switch Site to Australia
							</Button>
						</li>
						<li>
							<Button
								onClick={this.switchCountry.bind(
									this,
									"Canada",
									{
										woocommerce_store_address: "40 Bay St",
										woocommerce_store_address_2: "",
										woocommerce_store_city: "Toronto",
										woocommerce_default_country: "CA:ON",
										woocommerce_store_postcode: "M5J 2X2",
										woocommerce_currency: "CAD",
										woocommerce_price_thousand_sep: " ",
										woocommerce_price_decimal_sep: ",",
										woocommerce_weight_unit: "kg",
										woocommerce_dimension_unit: "cm",
									}
								)}
								className="woo button"
							>
								Switch Site to Canada
							</Button>
						</li>
						<li>
							<Button
								onClick={this.testRequest}
								className="woo button"
							>
								Test an HTTP request
							</Button>
						</li>
						<li>
							<Button
								onClick={this.launchPostman}
								className="woo button"
							>
								Launch Postman
							</Button>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
