// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';

export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;

	LocalMain.addIpcAsyncListener('get-random-count', async () => {
		return Math.floor(Math.random() * 100);
	});

	ipcMain.on('save-count', async (event, siteId, count) => {

		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
			'db',
			'export',
			context.environment.userHome + '/tmp/sqlexport.sql',
			'--socket=' + context.environment.userDataPath + '/run/' + siteId + '/mysql/mysqld.sock',
		]).then(function (result) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db export" ran.');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', result);
		}, function (err) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db export" failed.');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
			LocalMain.getServiceContainer().cradle.localLogger.log('info', site);
		});

		LocalMain.sendIPCEvent('instructions');
		LocalMain.getServiceContainer().cradle.localLogger.log('info', `Saving count ${count} for site ${siteId}.`);
		LocalMain.SiteData.updateSite(siteId, {
			id: siteId,
			count,
		});
	});

	ipcMain.on('switch-to-euro', async (event, siteId ) => {
		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
			'db',
			'import',
			context.environment.userHome + '/tmp/euro.sql',
			'--socket=' + context.environment.userDataPath + '/run/' + siteId + '/mysql/mysqld.sock',
			'--debug',
		]).then(function (result) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db import" ran.');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', result);
		}, function (err) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db import" failed.');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
		});

		LocalMain.sendIPCEvent('instructions');
	});

	/*cli wp option set woocommerce_store_address "60 29th Street"
	cli wp option set woocommerce_store_address_2 "#343"
	cli wp option set woocommerce_store_city "San Francisco"
	cli wp option set woocommerce_default_country "US:CA"
	cli wp option set woocommerce_store_postcode "94110"
	cli wp option set woocommerce_currency "USD"
	cli wp option set woocommerce_product_type "both"
	cli wp option set woocommerce_allow_tracking "no"*/
	ipcMain.on('switch-to-us', async (event, siteId ) => {
		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
			'option',
			'set',
			'woocommerce_store_address',
			'537 Paper Street',
		]).then(function (result) {
			LocalMain.getServiceContainer().cradle.wpCli.run(site, [
				'option',
				'set',
				'woocommerce_store_address_2',
				'#343',
			]).then(function (result) {
				LocalMain.getServiceContainer().cradle.wpCli.run(site, [
					'option',
					'set',
					'woocommerce_store_city',
					'Wilmington',
				]).then(function(result){
					LocalMain.getServiceContainer().cradle.wpCli.run(site, [
						'option',
						'set',
						'woocommerce_default_country',
						'US:DE',
					]).then(function(result){
						LocalMain.getServiceContainer().cradle.wpCli.run(site, [
							'option',
							'set',
							'woocommerce_store_postcode',
							'19806',
						]).then(function(result){
							LocalMain.getServiceContainer().cradle.wpCli.run(site, [
								'option',
								'set',
								'woocommerce_currency',
								'USD',
							]);
						},function(err){
							LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
						})

				},function(err){
					LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
				})
			}, function(err){
				LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
			})

			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Switcheroo completed without errors');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', result);
		}).then(function(){

		}, function (err) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Command "wp db import" failed.');
			LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
			LocalMain.getServiceContainer().cradle.localLogger.log('info', site);
		});
		LocalMain.sendIPCEvent('instructions');
	});

	})
}
