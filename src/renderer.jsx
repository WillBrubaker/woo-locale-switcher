import Addon from './Addon';
import fs from 'fs-extra';
import path from 'path';

const packageJSON = fs.readJsonSync( path.join( __dirname, '../package.json' ) );
const addonID = packageJSON['slug'];

export default function ( context ) {
	const {React, hooks} = context;
	const {Route} = context.ReactRouter;
	const stylesheetPath = path.resolve(__dirname, '../style.css');

	//insert our stylesheet
	hooks.addContent('stylesheets', () => <link rel="stylesheet" key="notes-addon-styleesheet" href={stylesheetPath} />);

	// Create the route/page of content that will be displayed when the menu option is clicked
	hooks.addContent( 'routesSiteInfo', () =>
		<Route key={`${addonID}-addon`} path={`/main/site-info/:siteID/${addonID}`}
			render={( props ) => <Addon {...props} />} /> );

	// Add menu option within the site menu bar
	hooks.addFilter( 'siteInfoMoreMenu', function ( menu, site ) {
		menu.push( {
			label : 'Woo Locale Switcher',
			enabled : true,
			click : () => {
				context.events.send( 'goToRoute', `/main/site-info/${site.id}/${addonID}` );
			}
		} );

		return menu;
	} );
}
