var jqueryRenderTest = TestCase("jqueryRenderTest");


jqueryRenderTest.prototype = {
    setUp: function(){
    },
    
    render : function( t, o ){
        var h = $( document.body ).render( t, o ).html().replace( /\r\n/g, "" );
        return new RegExp( h, "gi" );
    },
    
    /*
     * JsTestDriver is not supported to get html file 
     * @ignore
     * 
     */
//    testRender_temFile : function(){
//        var o, t;
//        
//        //single replace
//        o = {
//            message : "Hello World!"
//        };
//        
//        assertNotNull( String(
//            "<h1>Hello World!</h1>" ).match( this.render( "../tem/test.tem", o ) ) );
//            
//        assertNull(String(
//            "<h1>Hello Goodbye!</h1>" ).match( this.render( "../tem/test.tem", o ) ) );
//    },
    
    testRender_single : function(){
        var o, t;
        
        //single replace
        t = "<p>Name : ${name}</p>";
        o = {
            name : "Mike"
        };
        
        assertNotNull( String(
            "<p>Name : Mike</p>" ).match( this.render( t, o ) ) );
            
        assertNull(String(
            "<p>Name : Josey</p>").match( this.render( t, o ) ) );
    },
    
    testRender_double : function(){
        var o, t;
        
        //double replace
        t = "<p>Name : ${name}</p>" +
            "<p>Age : ${age}</p>";
        o = {
            name : "Mike", 
            age : 18
        };
        
        assertNotNull( String(
            "<p>Name : Mike</p>" +
            "<p>Age : 18</p>").match( this.render( t, o ) ) );
        
        assertNull( String(
            "<p>Name : Mike</p>" +
            "<p>Age : 19</p>").match( this.render( t, o ) ) );
    },
    
    testRender_array : function(){
        var o, t;
        
        //each replace
        t = "<h1>${name}</h1>"+
            "<ul>"+
            "${libraries}.each(<li>${i}</li>)"+
            "</ul>";
        o = {
            name : "javascript",
            libraries : [
                "jquery", "prototype.js", "MooTools"
            ]
        };
        
        assertNotNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>jquery</li>"+
            "<li>prototype.js</li>"+
            "<li>MooTools</li>"+
            "</ul>").match( this.render( t, o ) ) );
        
        assertNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>prototype.js</li>"+
            "</ul>").match( this.render( t, o ) ) );
    },
    
    testRender_array_object : function(){
        var o, t;
        
        //each replace
        t = "<h1>${name}</h1>"+
            "<ul>"+
            "${libraries}.each(<li>${i.name}-${i.url}</li>)"+
            "</ul>";
        o = {
            name : "javascript",
            libraries : [
                {
                    url  : "http://jquery.com",
                    name : "jquery"
                },
                {
                    url  : "http://www.prototypejs.org/",
                    name : "prototype.js",
                },
                {
                    url  : "http://mootools.net/",
                    name : "MooTools"
                }
            ]
        };
        assertNotNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>jquery-http://jquery.com</li>"+
            "<li>prototype.js-http://www.prototypejs.org/</li>"+
            "<li>MooTools-http://mootools.net/</li>"+
            "</ul>").match( this.render( t, o) ) );
        
        assertNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>prototype.js-http://www.prototypejs.org/</li>"+
            "</ul>").match( this.render( t, o ) ) );
    },
    
    testRender_object : function(){
        var o, t;
        
        //each replace
        t = "<h1>${name}</h1>"+
            "<ul>"+
            "${libraries}.each(<li>${i}-${i.url}</li>)"+
            "</ul>";
        o = {
            name : "javascript",
            libraries : {
                "jquery" : {
                    url  : "http://jquery.com"
                },
                "prototype.js" : {
                    url  : "http://www.prototypejs.org/"
                },
                "MooTools" : {
                    url  : "http://mootools.net/"
                }
            }
        };
        
        assertNotNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>jquery-http://jquery.com</li>"+
            "<li>prototype.js-http://www.prototypejs.org/</li>"+
            "<li>MooTools-http://mootools.net/</li>"+
            "</ul>").match( this.render( t, o ) ) );
        
        assertNull( String(
            "<h1>javascript</h1>"+
            "<ul>"+
            "<li>prototype.js-http://www.prototypejs.org/</li>"+
            "</ul>").match( this.render( t, o ) ) );
    },
    
    testRender_object_object : function(){
        var o, t;
        
        //each replace
        t = "<h1>${name}</h1>"+
            "<div>"+
            "<h2>jquery</h2><ul>${libraries.jquery}.each(<li><span>${i}</span><span>${i.url}</span></li>)</ul>"+
            "</div>";
        o = {
            name : "javascript",
            libraries : {
                "jquery" : {
                    "jquery.ui" : {
                        url : "http://jquery.com"
                    } ,
                    "jquery.sidebar" : {
                        url : "http://sideroad.secret.jp/plugins/"
                    }
                }
            }
        };
        
        assertNotNull( String(
            "<h1>javascript</h1>"+
            "<div>"+
            "<h2>jquery</h2><ul>"+
            "<li><span>jquery.ui</span><span>http://jquery.com</span></li>"+
            "<li><span>jquery.sidebar</span><span>http://sideroad.secret.jp/plugins/</span></li>"+
            "</ul>"+
            "</div>" ).match( this.render( t, o ) ) );
        
        assertNull( String(
            "<h1>javascript</h1>"+
            "<div>"+
            "<h2>jquery</h2><ul>"+
            "<li><span>jquery.ui</span><span>http://jquery.com</span></li>"+
            "</ul>"+
            "</div>" ).match( this.render( t, o ) ) );
    }
}