<?php
namespace Relementify;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Masks {
	public function __construct() {
		add_filter( 'elementor/mask_shapes/additional_shapes',  [ $this, 'custom_elementor_masks' ] );
	}

	public function custom_elementor_masks(): array {
		return [
			'relementify-trefoil' => [
				'title' => esc_html__( 'Trefoil', 'relementify' ),
				'image' => RELEMENTIFY_URL . 'assets/images/masks/trefoil.svg',
			],
			'relementify-quatrefoil' => [
				'title' => esc_html__( 'Quatrefoil', 'relementify' ),
				'image' => RELEMENTIFY_URL . 'assets/images/masks/quatrefoil.svg',
			],
			'relementify-cinquefoil' => [
				'title' => esc_html__( 'Cinquefoil', 'relementify' ),
				'image' => RELEMENTIFY_URL . 'assets/images/masks/cinquefoil.svg',
			],
			'relementify-sexfoil' => [
				'title' => esc_html__( 'Sexfoil', 'relementify' ),
				'image' => RELEMENTIFY_URL . 'assets/images/masks/sexfoil.svg',
			],
			'relementify-asterisk' => [
				'title' => esc_html__( 'Asterisk', 'relementify' ),
				'image' => RELEMENTIFY_URL . 'assets/images/masks/asterisk.svg',
			],
		];
	}
}
