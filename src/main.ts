// https://getflywheel.github.io/local-addon-api/modules/_local_main_.html
import * as LocalMain from '@getflywheel/local/main';

export default function (context) {
	const { electron } = context;
	const { ipcMain } = electron;

	ipcMain.on('test-request', async () => {
		context.request('https://github.com/woocommerce/woocommerce-subscriptions/releases/download/4.0.2/woocommerce-subscriptions.zip').pipe(context.fileSystem.createWriteStream(context.environment.userHome + '/subs.zip'))

	});

	ipcMain.on('switch-country', async (event, siteId, options) => {
		// Get site object.
		const site = LocalMain.getServiceContainer().cradle.siteData.getSite(siteId);
		var error = false;
		for (var option in options) {
			await LocalMain.getServiceContainer().cradle.wpCli.run(site, [
				'option',
				'set',
				option,
				options[option],
			]).then(function () { }, function (err) {
				LocalMain.sendIPCEvent('error');
				LocalMain.getServiceContainer().cradle.localLogger.log('info', err);
				error = true;
			});
		}

		if ( !error ) {
			LocalMain.getServiceContainer().cradle.localLogger.log('info', 'Switcheroo completed without errors');
			LocalMain.sendIPCEvent('instructions');
		}
		
	});
}
