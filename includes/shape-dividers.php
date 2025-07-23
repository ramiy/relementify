<?php
namespace Relementify;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class ShapeDividers {
	public function __construct() {
		add_filter( 'elementor/shapes/additional_shapes',  [ $this, 'custom_elementor_dividers' ] );
	}

	public function custom_elementor_dividers(): array {
		return [
			'relementify-clouds' => [
				'title'        => esc_html__( 'Clouds', 'relementify' ),
				'url'          => RELEMENTIFY_URL . 'assets/images/dividers/clouds-reg.svg',
				'path'         => RELEMENTIFY_PATH . 'assets/images/dividers/clouds-reg.svg',
				'height_only'  => true,
			],
			'relementify-clouds-multiple' => [
				'title'        => esc_html__( 'Multiple Clouds', 'relementify' ),
				'url'          => RELEMENTIFY_URL . 'assets/images/dividers/clouds-multiple.svg',
				'path'         => RELEMENTIFY_PATH . 'assets/images/dividers/clouds-multiple.svg',
				'has_flip'     => true,
			],
			'relementify-drops' => [
				'title'        => esc_html__( 'Drops', 'relementify' ),
				'url'          => RELEMENTIFY_URL . 'assets/images/dividers/drops.svg',
				'path'         => RELEMENTIFY_PATH . 'assets/images/dividers/drops.svg',
				'has_flip'     => true,
			],
			'relementify-pets' => [
				'title'        => esc_html__( 'Pets', 'relementify' ),
				'url'          => RELEMENTIFY_URL . 'assets/images/dividers/pets.svg',
				'path'         => RELEMENTIFY_PATH . 'assets/images/dividers/pets.svg',
				'has_flip'     => true,
			],
			'relementify-travel-sightseeing' => [
				'title'        => esc_html__( 'Travel Sightseeing', 'relementify' ),
				'url'          => RELEMENTIFY_URL . 'assets/images/dividers/travel-sightseeing.svg',
				'path'         => RELEMENTIFY_PATH . 'assets/images/dividers/travel-sightseeing.svg',
				'has_flip'     => true,
			],
		];
	}
}
