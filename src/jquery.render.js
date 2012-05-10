/*!
 * jquery.render v1.2.4
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
            return seek( obj[ key ], keys );
        },
        inception = function( obj, keys, val ){
            var key = keys.shift();
            
            if( !keys.length) {
                obj[ key ] = val;
                return obj;
            } else {
                if( !obj[ key ]) obj[key] = {};
                return inception( obj[ key ], keys, val );
            }            
        },
        currying = function(f){
            var slice = Array.prototype.slice,
                arg = slice.call(arguments);
            arg.shift();
            return function(){
                var _arg = slice.call(arguments);
                return f.apply(this, arg.concat(_arg));
            };
        },
		escapeHTML = function( s ){
            return String( s ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
        objectReplace = function( obj, word, isRaw, key ){
            var index = key.match( /\[(\d+)\]/ );
            if ( index && index[ 1 ] ) {
                key = index[ 1 ];
            }
            return isRaw ? obj[ key ] : escapeHTML( obj[ key ] );
        },
        keyValReplace = function( key, val, word, isRaw, type ){
            var text = ( type == "val" ) ? val : key;
            return isRaw ? text : escapeHTML( text );
        },
        wordReplace = function( text ){
            var words = word[ language ];
            return text.replace(/\$w\{([^\}]+)\}/g, function( text, key ){
                return escapeHTML( words[ key ] );
            });
        },
        each = function( template, source ) {
            template = $("<div>"+template+"</div>");
            
            template.find("[data-render]").each(function(){
                    var elem = $(this),
                    data = elem.data("render").match(/^\$(?:\{|%7B)(.+)(?:\}|%7D)\.(\w+)$/),
                    method = data[2],
                    key = data[1],
                    val = ( key == "this" || key == "" ) ? source : 
                          seek( source, key.replace(/(\[(\d+)\])/g,".$2").replace(/^\./,"").split( "." ) ),
                    i = 0,
                    length,
                    childVal,
                    child,
                    childText,
                    text = "";
                
                elem.removeAttr("data-render");
                child = (method == "in") ? elem.html() :
                        (method == "each") ? elem[0].outerHTML : 
                        (method == "bind") ? elem[0].outerHTML : "";
                
                if(method == "bind"){
                    childText = child;
                    if( $("<div>"+child+"</div>").find("[data-render]").length ){
                        childText = each( child, val );
                    }
                    text = childText.replace( /\$(r?){([^\}]+)}/g, currying( objectReplace, val))
                                    .replace( /\$(r?)(val|key)/g, currying( keyValReplace, key, val ));
                } else {
                    if( val instanceof Array ) {
                        length = val.length;
                        for( i = 0; i<length; i++ ) {
                            childVal = val[ i ];
                            childText = child;
                            if( $("<div>"+child+"</div>").find("[data-render]").length ){
                                childText = each( childText, childVal );
                            }
                            text += childText.replace( /\$(r?){([^\}]+)}/g, currying( objectReplace, childVal ))
                                             .replace( /\$(r?)(val)/g, currying( keyValReplace, null, childVal ));
                        }
                    } else if( typeof val === "object" ) {
                        for( key in val ) {
                            childVal = val[ key ];
                            childText = child;
                            if( $("<div>"+child+"</div>").find("[data-render]").length ){
                                childText = each( childText, childVal );
                            }
                            text += childText.replace( /\$(r?){([^\}]+)}/g, currying( objectReplace, childVal))
                                             .replace( /\$(r?)(val|key)/g, currying( keyValReplace, key, childVal ));
                        }
                    }
                }
                method == "in" ? elem.html(text) : 
                method == "each" ? elem.replaceWith( text ) : 
                method == "bind" ? elem.replaceWith( text ) : "";
                
            });
            
            return template.html();
            
        },
        bind = function( template, source ){
            
            template = each( template, source );
            var text = template.replace( /\$(r?)\{([^\}]+)\}/g, function( word, isRaw, key ){
                var text = seek( source, key.replace(/^this/, "" ).replace(/(\[(\d+)\])/g,".$2").replace(/^\./,"").split( "." ) );
                return isRaw ? text : escapeHTML( text );
            });
                
            return ( isLoaded[ language ] ) ? wordReplace( text ) : text;
            
        };
    
    /**
     * $.fn.render
     * Replace template string by the source object
     * The template string is taken by Ajax when the first parameter is object.
     * @namespace
     * @param {String||Object} template string or Ajax settings
     * @param {Object} source object
     * @returns {Object} jQuery element object
     */
    $.fn.render = function( template, source ){
        var ajax = false,
            baseUrl,
            callback;
        
        if ( typeof template == "object" && ! ( template instanceof String ) ) {
            ajax = template;
        }

        if( ajax ){
            baseUrl = ajax.url + suffix;
            callback = ajax.success;
            
            return this.each( function(){
                var elem = $(this),
                    cnt = 1,
                    replace = function(template){
                        template = $("<div>"+template+"</div>");
                        template.find("[data-include]").each(function(){
                            var child = $(this);
                            child.html(cache[child.data("include")]);
                            child.removeAttr("data-include");
                        });
                        
                        return template.find("[data-include]").length ? replace( template.html() ) : template.html();
                        
                    },
                    getTemplate = function(url){
        
                        $.ajax( $.extend( true, 
                            ajax, {
                                url : url,
                                dataType : "text",
                                success : function( template ){
                                    var child = $("<div>"+template+"</div>").find("[data-include]");
                                    cnt = cnt + child.length -1;
                                    
                                    cache[ url ] = template;
                                    if(cnt){
                                        child.each(function(){                                       
                                            getTemplate($(this).data("include")); 
                                        });
                                    } else {
                                        elem.html( bind( replace( cache[ baseUrl ] ), source ) );
                                        if ( callback ) callback();    
                                    }
                                    
                                }
                            }
                        ));
                    };
                if( cache[ baseUrl ] ) {
                    elem.html( bind( replace( cache[ baseUrl ] ), source ) );
                    if ( callback ) callback();
                } else {
                    getTemplate(baseUrl);
                }
            });
        } else {
            return this.each( function(){
                var elem = $(this),
				    text = bind( template, source );
                elem.html( text );
            } );
        }
    };
    

    /**
     * $.word
     * Load a word setting file
     * Language is automatically taken by navigator object, which you omit a set language.
     * 
     * @namespace
     * @param {Object} word files URL
     *     exp)
     *     { en : "word.en", ja : "word.ja"}
     * @param {String} Default Language ( Omittable )
     * @param {String} Fixed Language ( Omittable )
     * @param {Function} Callback function ( Omittable )
     */
    $.word = function( urls, def, fixed, callback ){
        var lang = fixed || (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
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
	
	/**
	 * Set render file suffix which called ajax render request
	 * @namespace
     * @param {Object} userAgents setting
     *     exp)
     *     { ".an" : /Android/, ".ip" : /iPhone|iPad/ }
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
	
	/**
	 * Clear suffix settings
	 * @namespace
	 * 
	 */
	$.clearSuffix = function(){
	    suffix = "";
	};
    
    /**
     * Export local value for Unit testing
     */
    $.__render__ = {
            seek : seek,
            inception : inception,
			escapeHTML : escapeHTML,
            word : word,
			userAgent : navigator.userAgent
    };

    
})( jQuery );
