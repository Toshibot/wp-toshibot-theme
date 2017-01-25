<?php
    function my_theme_enqueue_styles() {

        $parent_style = 'parent-style'; // This is 'twentyfifteen-style' for the Twenty Fifteen theme.

        wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
        wp_enqueue_style( 'child-style',
            get_stylesheet_directory_uri() . '/style.css',
            array( $parent_style ),
            wp_get_theme()->get('Version')
        );
    }
    add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );
?>

<?php 
    add_action("login_head", "my_login_head");
    function my_login_head() {
        echo "
        <style>
        body.login #login h1 a {
            background: url('/wp-content/themes/toshibot/login-logo.png') no-repeat scroll center top transparent !important;
            height: 128px;
            width: 128px;
            margin-bottom: 50px;
        }
        </style>
        ";
    }

    function my_login_logo_url() {
        return get_bloginfo( 'url' );
    }
    add_filter( 'login_headerurl', 'my_login_logo_url' );

    function my_login_logo_url_title() {
        return '';
    }
    add_filter( 'login_headertitle', 'my_login_logo_url_title' );

?>