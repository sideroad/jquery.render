/*
 * jquery.render v1.0.1
 * http://sideroad.secret.jp/
 *
 * Render template engine plugin
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
    var cache = {};
    
    var seek = function( obj, a ){
        if( !a.length ) return obj;
        var e = a.shift();
        return arguments.callee( obj[e], a );
    };

    var bind = function( tem, o ){
        return tem.replace( /\$\{([^\}]+)\}\.each\(([^\)]+)\)/g, function( w, k, t ){
            var v = seek( o, k.split( "." ) ),
                i,
                l,
                tt = "";
            
            if( v instanceof Array ) {
                l = v.length;
                for( i = 0; i<l; i++ ) {
                    e = v[i];
                    tt += t.replace( /\${i\.([^\}]+)}/g, function( w, kk ){
                        return e[kk];
                    }).replace( /\$\{i\}/g, e );
                }
            } else if( typeof v === "object" ) {
                for( i in v ) {
                    e = v[i];
                    tt += t.replace( /\${i\.([^\}]+)}/g, function( w, kk ){
                        return e[kk];
                    }).replace( /\$\{i\}/g, i );
                }
                
            }
            return tt;
        }).replace( /\$\{([^\}]+)\}/g, function( w, k ){
            return seek( o, k.split( "." ) );
        });
    };
    
    /*
     * $.fn.render
     * 
     * @param {String} Template URL or template string
     * @param {Object} Source object
     * @returns jQuery object
     */
    $.fn.render = function( t, o ){
        return this.each( function(){
            if( /\.tem$/.test( t ) ){
                if( cache[t] ) {
                    $(this).html( bind( cache[t], o ) );
                } else {
                    $.get( t, function( t ){
                        $(this).html( bind( t, o ) );
                    });
                }
            } else {
                $(this).html( bind( t, o ) );
            }
            
        });
    }
})( jQuery );