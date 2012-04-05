(function( $ ) {

module( "jquery.render" );

var map = {
        name : "Amber",
        age : 4,
        type : "mix"
    },
    list = [
        1, 2, 3
    ],
    mappedMap = {
        Amber : {
            age : 4,
            type : "mix"
        }, 
        Maruchan : {
            age : 2,
            type : "american-short-hair"
        }
    },
    mappedMappedMap = {
        Dog : {
            Ruby : {
                age : 5,
                type : "Papion"
            }
        },
        Cat : mappedMap
    },
    mapedList = {
        Cat : [ "Amber", "Maruchan" ],
        Turtle : [ "Kamekichi", "Kameko" ]
    },
    listedMap = [
        {
            name : "Amber",
            age : 4,
            type : "mix"
        },
        {
            name : "Maruchan",
            age : 2,
            type : "american-short-hair"
        }
    ],
    listedList = [
        [ "Amber", "Maruchan" ],
        [ "Kamekichi", "Kameko" ]
    ],
    notExists = {
    	name : null,
    	age : undefined
    },
    escapeHTML = {
        name : '<span>"&"</span>',
        list : [ '<span>"&"</span>'],
        map : {
            name : '<span>"&"</span>'
        }
    },
    raw = {
        name : '<span>"&"</span>',
        list : [ '<span>"&"</span>'],
        map : {
            name : '<span>"&"</span>'
        }
    };

test( "property", function() {
    expect( 9 );

    equals($( "#ren" ).render( "<p>${name} is ${age} years old.</p>", map ).html(),
                                         "<p>Amber is 4 years old.</p>");
										 
    equals($( "#ren" ).render( "<p>${this.name} is ${this.age} years old.</p>", map ).html(),
                                         "<p>Amber is 4 years old.</p>");
    
    equals($( "#ren" ).render( "<p>${[0]}, ${[1]}, ${[2]}!</p>", list ).html(),
                                         "<p>1, 2, 3!</p>");
										 
    equals($( "#ren" ).render( "<p>${this[0]}, ${this[1]}, ${this[2]}!</p>", list ).html(),
                                         "<p>1, 2, 3!</p>");
    
    equals($( "#ren" ).render( "<p>Amber is ${Amber.age} years old.</p>"+
                                         "<p>Maruchan is ${Maruchan.type}.</p>", mappedMap ).html(),
                                         "<p>Amber is 4 years old.</p>"+
                                         "<p>Maruchan is american-short-hair.</p>");
    
    equals($( "#ren" ).render( "<p>The most smallest cat is ${Cat[0]}.</p>"+
                                  "<p>The most biggest turtle is ${Turtle[1]}.</p>", mapedList ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest turtle is Kameko.</p>" );
    
    equals($( "#ren" ).render( "<p>The most smallest cat is ${[0].name}.</p>"+
                                  "<p>The most biggest cat is ${[1].name}.</p>", listedMap ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest cat is Maruchan.</p>" );
    
    equals($( "#ren" ).render( "<p>The most smallest cat is ${[0][0]}.</p>"+
                                  "<p>The most biggest turtle is ${[1][1]}.</p>", listedList ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest turtle is Kameko.</p>" );
								  
	
    equals($( "#ren" ).render( "<p>${name} is ${age} years old.</p>", notExists ).html(),
                                         "<p>null is undefined years old.</p>");
});

test( "each", function() {
    expect( 14 );

    equals($( "#ren" ).render( "<div><each src='${this}'><p>$key is $val.</p></each></div>", map ).html(),
                                         "<div><p>name is Amber.</p><p>age is 4.</p><p>type is mix.</p></div>");
    
    equals($( "#ren" ).render( "<each src='${this}'><p>$val</p></each>", list ).html(),
                                  "<p>1</p><p>2</p><p>3</p>");

    equals($( "#ren" ).render( "<h1>Amber</h1><dl><each src='${Amber}'><dt>$key</dt><dd>$val</dd></each></dl>", mappedMap ).html(),
                                  "<h1>Amber</h1><dl><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>");
    equals($( "#ren" ).render( "<each src='${this}'><h1>$key</h1><dl><dt>age</dt><dd>${age}</dd></dl></each>", mappedMap ).html(),
                                  "<h1>Amber</h1><dl><dt>age</dt><dd>4</dd></dl>"+
                                  "<h1>Maruchan</h1><dl><dt>age</dt><dd>2</dd></dl>");


    equals($( "#ren" ).render( "<each src='${this}'><h1>$key</h1><dl><each src='${this}'><dt>$key</dt><dd>$val</dd></each></dl></each>", mappedMap ).html(),
                                 "<h1>Amber</h1><dl><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>"+
                                 "<h1>Maruchan</h1><dl><dt>age</dt><dd>2</dd><dt>type</dt><dd>american-short-hair</dd></dl>");

    equals($( "#ren" ).render( "<h1>Cat</h1><ul><each src='${Cat}'><li>$val</li></each></ul>", mapedList ).html(),
                                  "<h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul>" );
    equals($( "#ren" ).render( "<each src='${this}'><h1>$key</h1><ul><li>${[0]}</li><li>${[1]}</li></ul></each>", mapedList ).html(),
                                         "<h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul>" +
                                         "<h1>Turtle</h1><ul><li>Kamekichi</li><li>Kameko</li></ul>");

    equals($( "#ren" ).render( "<each src='${this}'><h1>$key</h1><ul><each src='${this}'><li>$val</li></each></ul></each>", mapedList ).html(),
                                 "<h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul><h1>Turtle</h1><ul><li>Kamekichi</li><li>Kameko</li></ul>" );
    
    equals($( "#ren" ).render( "<dl><each src='${[0]}'><dt>$key</dt><dd>$val</dd></each></dl>", listedMap ).html(),
                                  "<dl><dt>name</dt><dd>Amber</dd><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>" );
    equals($( "#ren" ).render( "<each src='${this}'><dl><dt>name</dt><dd>${name}</dd></dl></each>", listedMap ).html(),
                                  "<dl><dt>name</dt><dd>Amber</dd></dl>" +
                                  "<dl><dt>name</dt><dd>Maruchan</dd></dl>");

    equals($( "#ren" ).render( "<each src='${this}'><dl><each src='${this}'><dt>$key</dt><dd>$val</dd></each></dl></each>", listedMap ).html(),
                                 "<dl><dt>name</dt><dd>Amber</dd><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>" +
                                 "<dl><dt>name</dt><dd>Maruchan</dd><dt>age</dt><dd>2</dd><dt>type</dt><dd>american-short-hair</dd></dl>");

    equals($( "#ren" ).render( "<p><each src='${[0]}'><span>$val</span></each></p>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>");
                                  
    equals($( "#ren" ).render( "<each src='${this}'><p><span>${[0]}</span><span>${[1]}</span></p></each>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>" +
                                  "<p><span>Kamekichi</span><span>Kameko</span></p>");

    equals($( "#ren" ).render( "<each src='${this}'><p><each src='${this}'><span>$val</span></each></p></each>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>" +
                                  "<p><span>Kamekichi</span><span>Kameko</span></p>");
});

test( "escapeHTML", function() {
    expect( 1 );
    equals($( "#ren" ).render( "<p>${name}</p>"+
                                                 "<p>${list[0]}</p>"+
                                                 "<p>${map.name}</p>"+
                                                 "<each src='${list}'><p>$val</p></each>"+
                                                 "<each src='${map}' ><p>$val</p></each>", escapeHTML ).html(),
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>");
});
test( "raw", function() {
    expect( 1 );
    equals($( "#ren" ).render( "<p>$r{name}</p>"+
                                                 "<p>$r{list[0]}</p>"+
                                                 "<p>$r{map.name}</p>"+
                                                 "<each src='${list}'><p>$rval</p></each>"+
                                                 "<each src='${map}' ><p>$rval</p></each>", raw )[0].innerHTML,
                                                "<p><span>\"&amp;\"</span></p>"+
                                                "<p><span>\"&amp;\"</span></p>"+
                                                "<p><span>\"&amp;\"</span></p>"+
                                                "<p><span>\"&amp;\"</span></p>"+
                                                "<p><span>\"&amp;\"</span></p>");
});

asyncTest( "ajax", function(){
    expect( 1 );
    
    $("#ren").render({
        url : "test.ren",
        success : function(){
            equals( $("#ren").html() ,"<div><p>name is Amber.</p><p>age is 4.</p><p>type is mix.</p></div>" );
            start();
        }
    },map);
    
} );

asyncTest("word-setting-en", function(){
    expect( 1 );

    $.word( {
        en : "word.en",
        ja : "word.ja"
    } , "en", "en",function(){
	    $("#ren").render({
	        url : "word.ren",
	        success : function(){
	            equals( $("#ren").html(), 
	                "<div>Hello World!</div>\n" + 
	                "<dl>\n" + 
	                "  <dt>User ID</dt>\n" + 
	                "  <dd><input type=\"text\"></dd>\n" + 
	                "  <dt>Password</dt>\n" + 
	                "  <dd><input type=\"password\"></dd>\n" + 
	                "</dl>");
	            start();
	        }
	    });
	});
    
});

asyncTest("word-setting-ja", function(){
    expect( 1 );
    $.word( {
        en : "word.en",
        ja : "word.ja"
    } , "ja", "ja",function(){
	    $("#ren").render({
	        url : "word.ren",
	        success : function(){
	            equals( $("#ren").html(), 
	                "<div>こんにちわ</div>\n" + 
	                "<dl>\n" + 
	                "  <dt>ユーザID</dt>\n" + 
	                "  <dd><input type=\"text\"></dd>\n" + 
	                "  <dt>パスワード</dt>\n" + 
	                "  <dd><input type=\"password\"></dd>\n" + 
	                "</dl>");
	            start();
	        }
	    }); 
	});
    
});

asyncTest("suffix-userAgent-Chrome", function(){
    expect( 1 );
	$.__render__.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.106 Safari/535.2";
    $.renderSuffix( { ".gc" : /Chrome/, ".ff" : /Firefox/, ".ie" : /MSIE/, ".ip" : /iPhone/, ".ipd" : /iPad/ } );
    $("#ren").render({
        url : "suffix.ren",
        success : function(){
            equals( $("#ren").html(), 
                "<div>Chrome</div>");
            start();
            $.clearSuffix();
        }
    });
});

asyncTest("suffix-userAgent-iPhone", function(){
    expect( 1 );
    $.__render__.userAgent = "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; ja-jp) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8C148 Safari/6531.22.7";
    $.renderSuffix( { ".gc" : /Chrome/, ".ff" : /Firefox/, ".ie" : /MSIE/, ".ip" : /iPhone/, ".ipd" : /iPad/ } );
    $("#ren").render({
        url : "suffix.ren",
        success : function(){
            equals( $("#ren").html(), 
                "<div>iPhone</div>");
            start();
            $.clearSuffix();
        }
    });
});

// asyncTest("include", function(){
    // expect( 1 );
    // $("#ren").render({
        // url : "parent.ren",
        // success : function(){
            // equals( $("#ren").html(),
                // "<div>im parent</div>"+
                // "<h1>Dog</h1>"+
                // "<dl>"+
                // "<dt>name</dt><dd>Ruby</dd>"+
                // "<dt>age</dt><dd>5</dd>"+
                // "<dt>type</dt><dd>papillon</dd>"+
                // "</dl>"+
                // "<h1>Cat</h1>"+
                // "<dl>"+
                // "<dt>name</dt><dd>Amber</dd>"+
                // "<dt>age</dt><dd>4</dd>"+
                // "<dt>type</dt><dd>mix</dd>"+
                // "</dl>"+
                // "<dl>"+
                // "<dt>name</dt><dd>Maruchan</dd>"+
                // "<dt>age</dt><dd>2</dd>"+
                // "<dt>type</dt><dd>american-short-hair</dd>"+
                // "</dl>");
            // start();
        // }
    // }, mappedMappedMap);
// });

test("inception ( Local )", function(){
    var obj = { d : 1, e : [ true, false ]};
   $.__render__.inception( obj, "a.b.c".split("."), 123 );
   deepEqual( obj, {a:{b:{c:123}}, d : 1, e : [ true, false ]} );
});

test("seek ( Local )", function(){
    var obj = { a : { b : { c: 123}} },
       val = $.__render__.seek( obj, "a.b.c".split(".") );
   equals( val, "123" );
});


}( jQuery ) );