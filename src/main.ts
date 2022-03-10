// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';

export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;

	ipcMain.on('switch-country', async (event, siteId, address, address_2, city, country, postcode, currencyCode, thousandSep, decimalSep, weightUnit, dimensionUnit ) => {
		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
			'option',
			'set',
			'woocommerce_store_address',
			address,
		]).then(function () {
			LocalMain.getServiceContainer().cradle.wpCli.run(site, [
				'option',
				'set',
				'woocommerce_store_address_2',
				address_2,
			]).then(function () {
				LocalMain.getServiceContainer().cradle.wpCli.run(site, [
					'option',
					'set',
					'woocommerce_store_city',
					city,
				]).then(function () {
					LocalMain.getServiceContainer().cradle.wpCli.run(site, [
						'option',
						'set',
						'woocommerce_default_country',
						country,
					]).then(function () {
						LocalMain.getServiceContainer().cradle.wpCli.run(site, [
							'option',
							'set',
							'woocommerce_store_postcode',
							postcode,
						]).then(function () {
							LocalMain.getServiceContainer().cradle.wpCli.run(site, [
								'option',
								'set',
								'woocommerce_currency',
								currencyCode,
							]).then(function () {
								LocalMain.getServiceContainer().cradle.wpCli.run(site, [
									'option',
									'set',
									'woocommerce_price_thousand_sep',
									thousandSep,
								]).then(function () {
									LocalMain.getServiceContainer().cradle.wpCli.run(site, [
										'option',
										'set',
										'woocommerce_price_decimal_sep',
										decimalSep,
									]).then(function () {
										LocalMain.getServiceContainer().cradle.wpCli.run(site, [
											'option',
											'set',
											'woocommerce_weight_unit',
											weightUnit,
										]).then(function () {
											LocalMain.getServiceContainer().cradle.wpCli.run(site, [
												'option',
												'set',
												'woocommerce_dimension_unit',
												dimensionUnit,
											]).then(function () {
												}, function(err){
													LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
												});
											}, function(err){
												LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
											});
										}, function(err){
											LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
										});
									}, function(err){
										LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
									});
								}, function(err){
									LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
								});
							}, function(err){
								LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
							});
						}, function(err){
							LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
						});
					}, function(err){
						LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
					});
				}, function(err){
					LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
				});
			}, function(err){
				LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
			});
		LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Switcheroo completed without errors');
		LocalMain.sendIPCEvent('instructions');		
	});

	ipcMain.on('test-request', async () => {
		context.request('http://google.com/doodle.png').pipe(context.fileSystem.createWriteStream(context.environment.userHome + '/doodle.png'))

	})

}
