/*!
 * jquery.render v1.2.3
 * http://sideroad.secret.jp/
 *
 * Template render plugin
 * 
 * Copyright (c) 2011 sideroad
 *
 * Dual licensed under the MIT or GPL licenses.
 * Date: 2011-03-03
 * 
 * @author sideroad
 * @requires jQuery
 * 
 */

(function( $ ) {
    var cache = {},
        word = {},
		suffix = "",
        isLoaded = {},
        isLoading = {},
        language = "en",
        seek = function( obj, keys ){
            if( !keys.length ) return obj;
            var key = keys.shift();
            return arguments.callee( obj[ key ], keys );
        },
        inception = function( obj, keys, val ){
            var key = keys.shift();
            
            if( !keys.length) {
                obj[ key ] = val;
                return obj;
            } else {
                if( !obj[ key ]) obj[key] = {};
                return arguments.callee( obj[ key ], keys, val );
            }            
        },
        bind = function( template, source ){
            var text =  template.replace( /\$\{([^\}]+)\}\.each\(\{([^\)]+)\}\)/g, function( word, key, child ){
                var val = ( key == "this" ) ? source : seek( source, key.replace(/(\[(\d+)\])/g,".$2").replace(/^\./,"").split( "." ) ),
                    i = 0,
                    length,
                    childVal,
                    text = "";
                
                if( val instanceof Array ) {
                    length = val.length;
                    for( i = 0; i<length; i++ ) {
                        childVal = val[ i ];
                        text += child.replace( /\${([^\}]+)}/g, function( word, childKey ){
                            var index = childKey.match( /\[(\d+)\]/ );
                            if ( index && index[ 1 ] ) {
                                childKey = index[ 1 ];
                            }
                            return childVal[ childKey ];
                        }).replace( /\$val/g, childVal );
                    }
                } else if( typeof val === "object" ) {
                    for( key in val ) {
                        childVal = val[ key ];
                        text += child.replace( /\${([^\}]+)}/g, function( word, childKey ){
                            var index = childKey.match( /\[(\d+)\]/ );
                            if ( index && index[ 1 ] ) {
                                childKey = index[ 1 ];
                            }
                            return childVal[ childKey ];
                        }).replace( /\$val/g, childVal ).replace( /\$key/g, key );
                    }
                }
                return text;
            }).replace( /\$\{([^\}]+)\}/g, function( word, key ){
                return seek( source, key.replace(/^this/, "" ).replace(/(\[(\d+)\])/g,".$2").replace(/^\./,"").split( "." ) );
            });
            
            if( isLoaded[ language ] ) {
                text = wordReplace( text );
            }
            return text;
            
        },
        wordReplace = function( text ){
            var words = word[ language ];
            return text.replace(/\$w\{([^\}]+)\}/g, function( text, key ){
                return words[ key ];
            });
        };
    
    /*
     * $.fn.render
     * Replace template string by the source object
     *   @param {String} template string
     *   @param {Object} source object
     *   @returns {Object} jQuery element object
     * 
     * 
     * Replace template string from ajax by the source object
     *   @param {Object} Ajax settings
     *   @param {Object} source object
     *   @returns {Object} jQuery element object
     */
    $.fn.render = function( template, source ){
        var ajax = false,
            url,
            callback;
        if ( typeof template == "object" && ! ( template instanceof String ) ) {
            ajax = template;
        }

        if( ajax ){
            url = ajax.url + suffix;
            callback = ajax.success;
                    console.log(url);
            
            return this.each( function(){
                var elem = $(this);
                if( cache[ url ] ) {
                    elem.html( bind( cache[ url ], source ) );
                    if ( callback ) callback();
                } else {
                    $.ajax( $.extend( true, 
					    ajax, {
							url : url,
                            dataType : "text",
                            success : function( template ){
                                var text = bind( template, source );
                                elem.html( text );
                                cache[ url ] = template;
                                if ( callback ) callback();
                            }
                        }
					));
                }
            });
        } else {
            return this.each( function(){
                var elem = $(this);
                var text = bind( template, source );
                elem.html( text );
            } );
        }
    };
    

    /*
     * $.word
     * Load a word setting file
     * Language is automatically taken by navigator object, which you omit a set language.
     *   @param {Object} word files URL
     *       exp)
     *       { en : "word.en", ja : "word.ja"}
     *   @param {String} Default Language ( Omittable )
     *   @param {String} Fixed Language ( Omittable )
     *   @param {Function} Callback function ( Omittable )
     *       Explicitly set language
     */
    $.word = function( urls, def, fixed, callback ){
        lang = fixed || (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
        language = lang = ( urls[ lang ] ) ? lang : 
                                   ( urls[def] ) ? def : "en";
        
        if( word[ lang ] ) {
            return;
        } else {
            isLoading[ lang ] = true;        
            $.ajax({
                url : urls[ lang ],
                dataType : "text",
                success : function( text ){
                    var settings = text.split(/\n/),
                        length = settings.length,
                        i,
                    keyVal = [];
                word[ lang ] = {};
                for( i = 0; i < length; i ++ ){
                    keyVal = settings[ i ].split(/^([^=]+)=(.+)$/);
                    word[ lang ][ keyVal[ 1 ] ] = keyVal[ 2 ];
                }
                isLoading[ lang ] = false;
                isLoaded[ lang ] = true;
                callback();
            }
        });
        }
    };
	
	/*
	 * Set render file suffix which called ajax render request
     *   @param {Object} userAgents setting
     *       exp)
     *       { ".an" : /Android/, ".ip" : /iPhone|iPad/ }
	 */
	$.renderSuffix = function( userAgent ){
		userAgent = userAgent || {};
		var key = null,
			ua = $.__render__.userAgent;
		
		for( key in userAgent ){
			if( userAgent[ key ].test( ua ) ){
				suffix =  key;
			}
		}
		
	};
    
    /*
     * Unlocalize for QUnit
     */
    $.__render__ = {
            seek : seek,
            inception : inception,
            word : word,
			userAgent : navigator.userAgent
    };

    
})( jQuery );
