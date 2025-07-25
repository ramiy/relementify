<?php
/**
 * Plugin Name: Relementify
 * Description: Enhance your Elementor widgets' designs with widget presets in a canva-like interface.
 * Version: 1.0.0
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: relementify
 * Requires Plugins: elementor
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'RELEMENTIFY__FILE', __FILE__ );
define( 'RELEMENTIFY_URL', plugins_url( '/', RELEMENTIFY__FILE ) );
define( 'RELEMENTIFY_PATH', plugin_dir_path( RELEMENTIFY__FILE ) );

final class Relementify {
	const VERSION = '1.0.0';
	const MINIMUM_ELEMENTOR_VERSION = '3.20.0';
	const MINIMUM_PHP_VERSION = '7.4';

	private static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	public function __construct() {
		if ( ! $this->is_compatible() ) {
			return;
		}

		add_action( 'elementor/init', [ $this, 'init' ] );
	}

	public function is_compatible(): bool {
		// Check if Elementor installed and activated
		if ( ! did_action( 'elementor/loaded' ) ) {
			add_action( 'admin_notices', [ $this, 'admin_notice_missing_main_plugin' ] );
			return false;
		}

		// Check for required Elementor version
		if ( ! version_compare( ELEMENTOR_VERSION, self::MINIMUM_ELEMENTOR_VERSION, '>=' ) ) {
			add_action( 'admin_notices', [ $this, 'admin_notice_minimum_elementor_version' ] );
			return false;
		}

		// Check for required PHP version
		if ( version_compare( PHP_VERSION, self::MINIMUM_PHP_VERSION, '<' ) ) {
			add_action( 'admin_notices', [ $this, 'admin_notice_minimum_php_version' ] );
			return false;
		}

		return true;
	}

	public function admin_notice_missing_main_plugin(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

		$message = sprintf(
			'<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>',
			sprintf(
				/* translators: 1: Relementify 2: Elementor */
				esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'relementify' ),
				'<strong>' . esc_html__( 'Relementify', 'relementify' ) . '</strong>',
				'<strong>' . esc_html__( 'Elementor', 'relementify' ) . '</strong>'
			)
		);

		echo wp_kses_post( $message );
	}

	public function admin_notice_minimum_elementor_version(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

		$message = sprintf(
			'<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>',
			sprintf(
				/* translators: 1: Relementify 2: Elementor 3: Required Elementor version */
				esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'relementify' ),
				'<strong>' . esc_html__( 'Relementify', 'relementify' ) . '</strong>',
				'<strong>' . esc_html__( 'Elementor', 'relementify' ) . '</strong>',
				self::MINIMUM_ELEMENTOR_VERSION
			)
		);

		echo wp_kses_post( $message );
	}

	public function admin_notice_minimum_php_version(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

		$message = sprintf(
			'<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>',
			sprintf(
				/* translators: 1: Relementify 2: PHP 3: Required PHP version */
				esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'relementify' ),
				'<strong>' . esc_html__( 'Relementify', 'relementify' ) . '</strong>',
				'<strong>' . esc_html__( 'PHP', 'relementify' ) . '</strong>',
				self::MINIMUM_PHP_VERSION
			)
		);

		echo wp_kses_post( $message );		
	}

	public function init(): void {
		$this->load();
		$this->hooks();
	}

	public function load(): void {
		require_once RELEMENTIFY_PATH . 'includes/context-menu.php';
	}

	public function hooks(): void {
		new Relementify\ContextMenu();

		add_action( 'elementor/editor/after_enqueue_styles', [ $this, 'enqueue_elementor_editor_styles' ] );
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'enqueue_elementor_editor_scripts' ] );
	}

	public function enqueue_elementor_editor_styles(): void {
		wp_enqueue_style(
			'relementify',
			plugins_url( 'assets/css/relementify.css', __FILE__ ),
			[],
			self::VERSION
		);
	}

	public function enqueue_elementor_editor_scripts(): void {
		$translation_wp_info = [
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'ajaxNonce' => wp_create_nonce( 'local_presets' ),
			'assetsUrl' => esc_url( plugins_url( 'assets', __FILE__ ) ),
			'pro' => false,
		];

		$translation_strings = [
			// Widgets Panel
			'presetsToggleButton' => esc_html__( 'Widget Presets', 'relementify' ),
			// Presets Panel
			'presetsSync' => esc_html__( 'Sync Presets', 'relementify' ),
			'presetsClosePanel' => esc_html__( 'Close Presets Panel', 'relementify' ),
			'presetsPanelHeading' => esc_html__( 'Widget Presets', 'relementify' ),
			// Preset Categories
			'presetsCategoryBasic' => esc_html__( 'Basic Presets', 'relementify' ),
			'presetsCategoryPro' => esc_html__( 'Pro Presets', 'relementify' ),
			'presetsCategoryMyLocal' => esc_html__( 'My Local Presets', 'relementify' ),
			'presetsCategoryMyCloud' => esc_html__( 'My Cloud Presets', 'relementify' ),
			// No Presets
			'noPresets' => esc_html__( 'This widget has no presets.', 'relementify' ),
			'noLocalPresets' => esc_html__( "You haven't saved local presets yet.", 'relementify' ),
			'noCloudPresets' => esc_html__( "You haven't saved cloud presets yet.", 'relementify' ),
			// Context Menu
			'savePresetLocally' => esc_html__( 'Save Preset Locally', 'relementify' ),
			'savePresetToCloud' => esc_html__( 'Save Preset to Cloud', 'relementify' ),
			'presetNotSavedLocally' => esc_html__( 'Preset not saved. Please click the widget, and then try saving it as a local preset.', 'relementify' ),
		];

		$local_presets = json_encode( get_option( 'relementify_local_presets' ) );

		if ( ! is_array( $local_presets ) ) {
			$local_presets = [];
		}

		$editor_inline_script = "window.relementify ??= {};\n";
		$editor_inline_script .= sprintf( "relementify.wpInfo = %s;\n", wp_json_encode( $translation_wp_info ) );
		$editor_inline_script .= sprintf( "relementify.translations = %s;\n", wp_json_encode( $translation_strings ) );
		$editor_inline_script .= sprintf( "relementify.localPresets = %s;\n", wp_json_encode( $local_presets ) );

		wp_enqueue_script(
			'relementify-editor',
			plugins_url( 'assets/js/editor.js', __FILE__ ),
			[],
			self::VERSION,
			true
		);

		wp_add_inline_script(
			'relementify-editor',
			$editor_inline_script,
			'before'
		);
	}
}

add_action( 'plugins_loaded', [ 'Relementify', 'instance'] );
