<?php
namespace Relementify;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class ContextMenu {
	public function __construct() {
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_ajax_save_local_preset', [ $this, 'save_local_preset' ] );
		add_action( 'wp_ajax_nopriv_save_local_preset', [ $this, 'save_local_preset' ] );
	}

	public function enqueue_scripts(): void {
		wp_enqueue_script(
			'relementify-context-menu',
			RELEMENTIFY_URL . 'assets/js/context-menu.js',
			[ 'relementify-editor' ],
			null,
			true
		);
	}

	public function save_local_preset(): void {
		check_ajax_referer( 'local_presets', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'Permission denied' );
		}

		if ( ! isset( $_POST['presets'] ) ) {
			wp_send_json_error( 'No presets provided' );
		}

		update_option( 'relementify_local_presets', wp_json_encode( $_POST['presets'] ), false );

		wp_send_json_success();
	}
}