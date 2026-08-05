window.addEventListener( 'elementor/init', () => {
	relementify.savePresetLocally = () => {
		const data = Object.values( elementor.selection.elements ).map( ( container ) => container.model.toJSON() );

		if ( relementify.localPresets === undefined || ! Array.isArray( relementify.localPresets ) ) {
			relementify.localPresets = [];
		}

		if ( data.length === 0 ) {
			// eslint-disable-next-line no-alert -- The editor needs immediate feedback when no element is selected.
			window.alert( relementify.translations.presetNotSavedLocally );
			return;
		}

		const preset = {
			category: 'local',
			code: JSON.stringify(
				{
					type: 'elementor',
					siteurl: 'http://relementify.com/wp-json/',
					elements: [ data[ 0 ] ],
				},
			),
			id: data[ 0 ].id,
			image: '',
			title: `${ data[ 0 ].widgetType } ${ data[ 0 ].id }`,
			widget: data[ 0 ].widgetType,
		};

		relementify.localPresets.push( preset );

		window.jQuery.ajax( {
			url: relementify.wpInfo.ajaxUrl,
			method: 'POST',
			data: {
				action: 'save_local_preset',
				nonce: relementify.wpInfo.ajaxNonce,
				presets: relementify.localPresets,
			},
		} );
	};

	relementify.savePresetToCloud = () => {
		// TODO: implement this.
	};

	elementor.hooks.addFilter( 'elements/context-menu/groups', ( customGroups, elementType ) => {
		const newGroup = {
			name: 'relementify',
			actions: [
				{
					name: 'relementify-save-locally',
					title: relementify.translations.savePresetLocally,
					isEnabled: () => true,
					callback: () => relementify.savePresetLocally(),
				},
				{
					name: 'relementify-save-to-cloud',
					title: relementify.translations.savePresetToCloud,
					isEnabled: () => relementify.wpInfo.pro,
					callback: () => relementify.savePresetToCloud(),
				},
			],
		};

		if ( 'widget' === elementType ) {
			customGroups.push( newGroup );
		}

		return customGroups;
	} );
} );
