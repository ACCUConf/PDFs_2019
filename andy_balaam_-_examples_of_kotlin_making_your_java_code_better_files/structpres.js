"use strict";

(function( document, window, undef )
{

function StructPres()
{
    var structpres = this;

    structpres.body = null;
    structpres.slides = null;
    structpres.slide_bodies = null;
    structpres.anchor_links = null;

    structpres.current_slide = 0;

    structpres.KEY_PAGEUP   = 33;
    structpres.KEY_PAGEDOWN = 34;
    structpres.KEY_END      = 35;
    structpres.KEY_HOME     = 36;
    structpres.KEY_LEFT     = 37;
    structpres.KEY_RIGHT    = 39;

    structpres.anchorToSlideNum = function( anchor )
    {
        var href = anchor;

        switch( href )
        {
        case "":
            return 0;
        case "#contents":
            return 1;
        default:
            return 1 + parseInt(
                href.substring( "slide_".length + 1 ), 10 );
        }
    };

    structpres.onresize = function()
    {
        structpres.goToSlide( structpres.current_slide );

        var slideHeight = window.innerHeight;
        var slideWidth  = window.innerWidth;

        for( var i = 0; i < structpres.slides.length; ++i )
        {
            structpres.slides[i].style.height = slideHeight + "px";
        }

        structpres.body.style.fontSize = Math.min(
            ( slideWidth / 25.6 ), slideHeight / 19.2 ) + "px";

        function makeGoToFunction( href )
        {
            var slide_num = structpres.anchorToSlideNum( href );

            return function() {
                structpres.current_slide = slide_num;
            };
        }

        for( var j = 0; j < structpres.anchor_links.length; ++j )
        {
            structpres.anchor_links[j].onclick = makeGoToFunction(
                structpres.anchor_links[j].getAttribute( "href" )
            );
        }
    };

    structpres.onload = function()
    {
        structpres.body         = document.getElementsByTagName( "body" )[0];
        structpres.slides       = document.getElementsByClassName( "slide" );

        structpres.slide_bodies = document.getElementsByClassName(
            "slide_body" );

        structpres.anchor_links = document.getElementsByClassName(
            "go_to_slide" );

        structpres.current_slide = structpres.anchorToSlideNum(
            window.location.hash );

        structpres.onresize();
    };

    structpres.goToAnchor = function( anchor )
    {
        window.location.hash = "#" + anchor;
    };

    structpres.goToTop = function()
    {
        structpres.current_slide = 0;
        structpres.goToAnchor( "" );
    };

    structpres.goToSlide = function( slide_num )
    {
        switch( slide_num )
        {
            case 0:
                structpres.goToTop();
                break;
            case 1:
                structpres.goToAnchor( "contents" );
                break;
            default:
                structpres.goToAnchor( "slide_" + ( slide_num - 1 ).toString() );
                break;
        }
    };

    structpres.goToEnd = function()
    {
        structpres.current_slide = this.slides.length - 1;
        structpres.goToSlide( this.current_slide );
    };

    structpres.previousSlide = function()
    {
        if ( structpres.current_slide > 0 )
        {
            --structpres.current_slide;
        }

        structpres.goToSlide( structpres.current_slide );
    };

    structpres.nextSlide = function()
    {
        if ( structpres.current_slide < ( structpres.slides.length - 1 ) )
        {
            ++structpres.current_slide;
        }

        structpres.goToSlide( structpres.current_slide );
    };

    structpres.onkey = function( event )
    {
        switch( event.keyCode )
        {
        case structpres.KEY_LEFT:
        case structpres.KEY_PAGEUP:
            structpres.previousSlide();
            return false;
        case structpres.KEY_RIGHT:
        case structpres.KEY_PAGEDOWN:
            structpres.nextSlide();
            return false;
        case structpres.KEY_HOME:
            structpres.goToTop();
            return false;
        case structpres.KEY_END:
            structpres.goToEnd();
            return false;
        default:
            //console.log( "key=" + event.keyCode );
            break;
        }
    };

    window.onload      = function() { return structpres.onload();   };
    window.onresize    = function() { return structpres.onresize(); };
    document.onkeydown = function( event ) {
        return structpres.onkey( event );
    };
}

// Export as a pubic object so custom.js can monkey-patch it
document.structpres = new StructPres();

} ( document, window ) );

