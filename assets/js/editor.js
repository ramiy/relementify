window.addEventListener('elementor/init', () => {

	relementify.selectors = {
		// Widget panel.
		widgetPanelWrapperID: 'elementor-panel',
		widgetPanelHeaderID: 'elementor-panel-header',
		widgetPanelPresetsToggleButtonID: 'elementor-panel-header-toggle-preset',
		// Preset panel.
		presetPanelID: 'elementor-presets-panel',
		presetPanelHeaderClass: 'elementor-presets-panel-header',
		presetPanelContentClass: 'elementor-presets-panel-content',
		presetPanelSyncButtonID: 'elementor-sync-presets-panel',
		presetPanelCloseButtonID: 'elementor-close-presets-panel',
		presetPanelCategoryClass: 'elementor-presets-panel-category',
	};

	relementify.templates = {
		widgetPanelPresetButton: `
			<button
				type="button"
				id="${relementify.selectors.widgetPanelPresetsToggleButtonID}"
				class="elementor-header-button"
				aria-label="${relementify.translations.presetsToggleButton}"
				onClick="relementify.togglePresetsPanelState()"
			>
				<img
					src="${relementify.wpInfo.assetsUrl}/images/presets-button.svg"
					width="20"
					height="20"
					loading="lazy"
					alt="${relementify.translations.presetsToggleButton}"
				>
			</button>
		`,
		presetsPanel: `
			<div id="${relementify.selectors.presetPanelID}">
				<div class="${relementify.selectors.presetPanelHeaderClass}">
					<button
						type="button"
						id="${relementify.selectors.presetPanelSyncButtonID}"
						class="elementor-header-button"
						aria-label="${relementify.translations.presetsSync}"
						onClick="relementify.syncPresets()"
					>
						<img
							src="${relementify.wpInfo.assetsUrl}/images/sync-button.svg"
							width="20"
							height="20"
							loading="lazy"
							alt="${relementify.translations.presetsSync}"
						>
					</button>
					<h2>${relementify.translations.presetsPanelHeading}</h2>
					<button
						type="button"
						id="${relementify.selectors.presetPanelCloseButtonID}"
						class="elementor-header-button"
						aria-label="${relementify.translations.presetsClosePanel}"
						onClick="relementify.closePresetsPanel()"
					>
						<img
							src="${relementify.wpInfo.assetsUrl}/images/close-button.svg"
							width="20"
							height="20"
							loading="lazy"
							alt="${relementify.translations.presetsClosePanel}"
						>
					</button>
				</div>
				<div class="${relementify.selectors.presetPanelContentClass}">
					<details name="presets-category" open>
						<summary>${relementify.translations.presetsCategoryBasic}</summary>
						<div class="${relementify.selectors.presetPanelCategoryClass}" id="${relementify.selectors.presetPanelCategoryClass}-basic"></div>
					</details>
					<details name="presets-category">
						<summary>${relementify.translations.presetsCategoryPro}</summary>
						<div class="${relementify.selectors.presetPanelCategoryClass}" id="${relementify.selectors.presetPanelCategoryClass}-pro"></div>
					</details>
				</div>
			</div>
		`,
	};

	relementify.presetsPanelState = false;

	relementify.presetsWidget = '';

	relementify.presetsData = null;

	relementify.isWidgetPanel = (panel) => panel === 'widget';

	relementify.getCurrentWidget = () => Object.values(elementor.selection.elements).map((container) => container.model.toJSON({ remove: ['default'] }))[0].widgetType;

	relementify.getPresetsWidget = () => relementify.presetsWidget;

	relementify.setPresetsWidget = (widget) => relementify.presetsWidget = widget;

	relementify.hasPresetsToggleButton = () => !(document.getElementById(relementify.selectors.widgetPanelPresetsToggleButtonID) === null);

	relementify.addPresetsToggleButton = () => document.getElementById(relementify.selectors.widgetPanelHeaderID).insertAdjacentHTML('beforeend', relementify.templates.widgetPanelPresetButton);

	relementify.removePresetsToggleButton = () => document.getElementById(relementify.selectors.widgetPanelPresetsToggleButtonID)?.remove();

	relementify.getPresetsPanelState = () => relementify.presetsPanelState;

	relementify.setPresetsPanelState = (state) => relementify.presetsPanelState = state;

	relementify.createPresetsPanel = () => document.getElementById(relementify.selectors.widgetPanelWrapperID).insertAdjacentHTML('beforeend', relementify.templates.presetsPanel);

	relementify.destroyPresetsPanel = () => document.getElementById(relementify.selectors.presetPanelID)?.remove();

	relementify.closePresetsPanel = () => {
		relementify.setPresetsPanelState(false);
		relementify.setPresetsWidget('');
		relementify.destroyPresetsPanel();
	};

	relementify.openPresetsPanel = () => {
		relementify.setPresetsPanelState(true);
		relementify.createPresetsPanel();
		relementify.populatePresetsCategories();
	};

	relementify.togglePresetsPanelState = () => {
		const newState = !relementify.getPresetsPanelState();
		if (newState) {
			relementify.openPresetsPanel();
		} else {
			relementify.closePresetsPanel();
		}
	};

	relementify.getPresetsData = () => relementify.presetsData;

	relementify.setPresetsData = (presets) => relementify.presetsData = presets;

	relementify.hasPresetsData = () => Array.isArray(relementify.presetsData);

	relementify.getPresetsDataByID = (id) => relementify.getPresetsData().find((preset) => parseInt(id) === preset.id);

	relementify.loadRemotePresets = async (widget = '') => {
		let fullUrl = 'https://relementify.com/wp-json/relementify/v1/presets/';
		if (widget) {
			const queryParams = { widget };
			const queryString = new URLSearchParams(queryParams).toString();
			fullUrl = `${fullUrl}?${queryString}`;
		}
		const fetchOptions = { cache: 'no-cache' };
		const remotePreset = await fetch(fullUrl, fetchOptions).then((response) => response.json());
		return remotePreset;
	};

	relementify.syncPresets = async () => {
		const remotePreset = await relementify.loadRemotePresets();
		relementify.setPresetsData(remotePreset);
		if (relementify.getPresetsPanelState()) {
			relementify.populatePresetsCategories();
		}
	};

	relementify.populatePresetsCategories = () => {
		relementify.clearCategories();
		relementify.loadBasicPresets();
		relementify.loadProPresets();
	};

	relementify.getCategoryClass = (category) => `${relementify.selectors.presetPanelCategoryClass}-${category}`;

	relementify.clearCategories = () => {
		const categories = ['basic', 'pro'];
		const categoryElements = categories.map((category) => document.getElementById(relementify.getCategoryClass(category)));
		categoryElements.forEach((categoryElement) => categoryElement.innerHTML = '');
	};

	relementify.createPresetButton = (preset) => {
		const content = (preset?.image !== false && preset?.image !== '')
			? `<img src="${preset?.image}" loading="lazy" alt="${preset?.title}">`
			: preset?.title;

		return `<button type="button" class="widget-preset" onClick="relementify.applyPresetStyles(${preset?.id})">${content}</button>`;
	};

	relementify.loadBasicPresets = async () => {
		const currentCategory = 'basic';
		const currentWidget = relementify.getCurrentWidget();
		const widgetPreset = (relementify.hasPresetsData())
			? relementify.getPresetsData().filter((preset) => preset.widget === currentWidget && preset.category === currentCategory)
			: [];
		const presetsHtml = widgetPreset.map((preset) => relementify.createPresetButton(preset)).join('');
		const categoryClass = relementify.getCategoryClass(currentCategory);
		document.getElementById(categoryClass).insertAdjacentHTML('beforeend', presetsHtml || relementify.translations.noPresets);
	};

	relementify.loadProPresets = () => {
		const currentCategory = 'pro';
		const currentWidget = relementify.getCurrentWidget();
		const widgetPreset = (relementify.hasPresetsData())
			? relementify.getPresetsData().filter((preset) => preset.widget === currentWidget && preset.category === currentCategory)
			: [];
		const presetsHtml = widgetPreset.map((preset) => relementify.createPresetButton(preset)).join('');
		const categoryClass = relementify.getCategoryClass(currentCategory);
		document.getElementById(categoryClass).insertAdjacentHTML('beforeend', presetsHtml || relementify.translations.noPresets);
	};

	relementify.applyPresetStyles = async (id) => {
		const storageKey = 'relementify-preset-styles';
		const preset = relementify.getPresetsDataByID(id);

		console.log('preset', preset);
		elementorCommon.storage.set(storageKey, JSON.parse(preset.code));
		$e.run('document/elements/paste-style', { storageKey, containers: Object.values(elementor.selection.elements) });
	}

	relementify.syncPresets();

	window.addEventListener('elementor/routes/open', (event) => {
		const panelType = event?.currentTarget?.$e?.routes?.currentArgs?.panel?.model?.attributes?.elType;

		// Not a widget panel.
		if (!relementify.isWidgetPanel(panelType)) {
			if (relementify.hasPresetsToggleButton()) {
				relementify.removePresetsToggleButton();
			}
			if (relementify.getPresetsPanelState()) {
				relementify.closePresetsPanel();
			}
			return;
		}

		// Add presets button, if it doesn't exist.
		if (!relementify.hasPresetsToggleButton()) {
			relementify.addPresetsToggleButton();
		}
	});

	window.addEventListener('elementor/routes/close', (event) => {
		const panelType = event?.currentTarget?.$e?.routes?.currentArgs?.panel?.model?.attributes?.elType;

		if (relementify.isWidgetPanel(panelType)) {
			return;
		}

		relementify.closePresetsPanel();
		relementify.removePresetsToggleButton();
	});

	window.addEventListener('elementor/commands/run/after', (event) => {
		const isDeselectAll = 'document/elements/deselect-all' === event.detail.command;
		const isDeselect = 'document/elements/deselect' === event.detail.command;
		const isSelect = 'document/elements/select' === event.detail.command;

		// Close presets panel when `deselect` or `deselect all` event triggered.
		if (isDeselectAll || isDeselect) {
			relementify.closePresetsPanel();
			relementify.setPresetsWidget('');
			return;
		}

		// Get widget type when `select` event triggered.
		if (isSelect) {
			const currentWidget = event?.detail?.args?.container?.model?.get('widgetType');
			relementify.setPresetsWidget(currentWidget);

			if (relementify.getPresetsPanelState()) {
				relementify.populatePresetsCategories();
			}

			return;
		}
	});
});
