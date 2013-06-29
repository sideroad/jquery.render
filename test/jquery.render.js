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
    mappedList = {
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

    equal($( "#ren" ).render( "<p>${name} is ${age} years old.</p>", map ).html(),
                                         "<p>Amber is 4 years old.</p>");
										 
    equal($( "#ren" ).render( "<p>${this.name} is ${this.age} years old.</p>", map ).html(),
                                         "<p>Amber is 4 years old.</p>");
    
    equal($( "#ren" ).render( "<p>${[0]}, ${[1]}, ${[2]}!</p>", list ).html(),
                                         "<p>1, 2, 3!</p>");
										 
    equal($( "#ren" ).render( "<p>${this[0]}, ${this[1]}, ${this[2]}!</p>", list ).html(),
                                         "<p>1, 2, 3!</p>");
    
    equal($( "#ren" ).render( "<p>Amber is ${Amber.age} years old.</p>"+
                                         "<p>Maruchan is ${Maruchan.type}.</p>", mappedMap ).html(),
                                         "<p>Amber is 4 years old.</p>"+
                                         "<p>Maruchan is american-short-hair.</p>");
    
    equal($( "#ren" ).render( "<p>The most smallest cat is ${Cat[0]}.</p>"+
                                  "<p>The most biggest turtle is ${Turtle[1]}.</p>", mappedList ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest turtle is Kameko.</p>" );
    
    equal($( "#ren" ).render( "<p>The most smallest cat is ${[0].name}.</p>"+
                                  "<p>The most biggest cat is ${[1].name}.</p>", listedMap ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest cat is Maruchan.</p>" );
    
    equal($( "#ren" ).render( "<p>The most smallest cat is ${[0][0]}.</p>"+
                                  "<p>The most biggest turtle is ${[1][1]}.</p>", listedList ).html(),
                                  "<p>The most smallest cat is Amber.</p>"+
                                  "<p>The most biggest turtle is Kameko.</p>" );
								  
	
    equal($( "#ren" ).render( "<p>${name} is ${age} years old.</p>", notExists ).html(),
                                         "<p>null is undefined years old.</p>");
});

test( "bind", function(){
    
    equal($( "#ren" ).render( "<div data-render='${Amber}.bind'>age is ${age}. type is ${type}.</div>", mappedMap ).html(),
            "<div>age is 4. type is mix.</div>" );
            
    equal($( "#ren" ).render( "<div data-render='${Dog.Ruby}.bind'>age is ${age}. type is ${type}.</div>", mappedMappedMap ).html(),
            "<div>age is 5. type is Papion.</div>" );
    
    equal($( "#ren" ).render( "<div data-render='${Cat}.bind'>${[0]} and ${[1]}</div>", mappedList ).html(),
            "<div>Amber and Maruchan</div>");
    
    equal($( "#ren" ).render( "<div data-render='${[0]}.bind'>${name} is ${age} years old.</div>", listedMap ).html(),
            "<div>Amber is 4 years old.</div>");
            
    equal($( "#ren" ).render( "<div data-render='${[1]}.bind'>${[0]} and ${[1]}</div>", listedList ).html(),
            "<div>Kamekichi and Kameko</div>");

    equal($( "#ren" ).render( "<div data-render='${Amber}.bind'><p data-render='${age}.bind'>age is $val.</p></div>", mappedMap ).html(),
            "<div><p>age is 4.</p></div>" );
            
    equal($( "#ren" ).render( "<p data-render='${[0]}.bind'><span data-render='${[0]}.bind'>$val</span></p>", listedList ).html(),
                                  "<p><span>Amber</span></p>", "nested");
    
});

test( "each", function() {

    equal($( "#ren" ).render( "<div><p data-render='${this}.each'>$key is $val.</p></div>", map ).html(),
                                         "<div><p>name is Amber.</p><p>age is 4.</p><p>type is mix.</p></div>");
    
    equal($( "#ren" ).render( "<p data-render='${this}.each'>$val</p>", list ).html(),
                                  "<p>1</p><p>2</p><p>3</p>");

    equal($( "#ren" ).render( "<div data-render='${this}.each'><h1>$key</h1><ul><li>${[0]}</li><li>${[1]}</li></ul></div>", mappedList ).html(),
                                         "<div><h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul></div>" +
                                         "<div><h1>Turtle</h1><ul><li>Kamekichi</li><li>Kameko</li></ul></div>");

    equal($( "#ren" ).render( "<dl data-render='${this}.each'><dt>name</dt><dd>${name}</dd></dl>", listedMap ).html(),
                                  "<dl><dt>name</dt><dd>Amber</dd></dl>" +
                                  "<dl><dt>name</dt><dd>Maruchan</dd></dl>");

    equal($( "#ren" ).render( "<p><span data-render='${[0]}.each'>$val</span></p>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>");
                                  
    equal($( "#ren" ).render( "<p data-render='${this}.each'><span>${[0]}</span><span>${[1]}</span></p>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>" +
                                  "<p><span>Kamekichi</span><span>Kameko</span></p>");

    equal($( "#ren" ).render( "<p data-render='${this}.each'><span data-render='${this}.each'>$val</span></p>", listedList ).html(),
                                  "<p><span>Amber</span><span>Maruchan</span></p>" +
                                  "<p><span>Kamekichi</span><span>Kameko</span></p>", "nested");
});

test( "in", function(){

    equal($( "#ren" ).render( "<h1>Amber</h1><dl data-render='${Amber}.in'><dt>$key</dt><dd>$val</dd></dl>", mappedMap ).html(),
                                  "<h1>Amber</h1><dl><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>");

    equal($( "#ren" ).render( "<div data-render='${this}.in'><h1>$key</h1><dl><dt>age</dt><dd>${age}</dd></dl></div>", mappedMap ).html(),
                                  "<div><h1>Amber</h1><dl><dt>age</dt><dd>4</dd></dl>"+
                                  "<h1>Maruchan</h1><dl><dt>age</dt><dd>2</dd></dl></div>");
    
    equal($( "#ren" ).render( "<h1>Cat</h1><ul data-render='${Cat}.in'><li>$val</li></ul>", mappedList ).html(),
                                  "<h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul>" );
    
    equal($( "#ren" ).render( "<dl data-render='${[0]}.in'><dt>$key</dt><dd>$val</dd></dl>", listedMap ).html(),
                                  "<dl><dt>name</dt><dd>Amber</dd><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl>" );

    equal($( "#ren" ).render( "<ul data-render='${Cat}.in'><li><dl data-render='${this}.in'><dt>$key</dt><dd>$val</dd></dl></li></ul>", mappedMappedMap ).html(),
                                  "<ul><li><dl><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl></li><li><dl><dt>age</dt><dd>2</dd><dt>type</dt><dd>american-short-hair</dd></dl></li></ul>", "nested" );

});


test( "nested several manipulation", function(){
    
    //each-in
    equal($( "#ren" ).render( "<div data-render='${this}.each'><h1>$key</h1><dl data-render='${this}.in'><dt>$key</dt><dd>$val</dd></dl>", mappedMap ).html(),
                                 "<div><h1>Amber</h1><dl><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl></div>"+
                                 "<div><h1>Maruchan</h1><dl><dt>age</dt><dd>2</dd><dt>type</dt><dd>american-short-hair</dd></dl></div>");

    equal($( "#ren" ).render( "<div data-render='${this}.each'><dl data-render='${this}.in'><dt>$key</dt><dd>$val</dd></dl></div>", listedMap ).html(),
                                 "<div><dl><dt>name</dt><dd>Amber</dd><dt>age</dt><dd>4</dd><dt>type</dt><dd>mix</dd></dl></div>" +
                                 "<div><dl><dt>name</dt><dd>Maruchan</dd><dt>age</dt><dd>2</dd><dt>type</dt><dd>american-short-hair</dd></dl></div>");
    
    //in-each         
    equal($( "#ren" ).render( "<div data-render='${this}.in'><h1>$key</h1><ul><li data-render='${this}.each'>$val</li></ul></div>", mappedList ).html(),
                                 "<div><h1>Cat</h1><ul><li>Amber</li><li>Maruchan</li></ul><h1>Turtle</h1><ul><li>Kamekichi</li><li>Kameko</li></ul></div>" );
    
    //bind-each
    equal($( "#ren" ).render( "<div data-render='${Amber}.bind'><span data-render='${this}.each'>$key is $val.</span></div>", mappedMap ).html(),
                               "<div><span>age is 4.</span><span>type is mix.</span></div>" );

    //each-bind
    equal($( "#ren" ).render( "<div data-render='${this}.each'><span data-render='${this}.bind'>age is ${age}.</span></div>", mappedMap ).html(),
                               "<div><span>age is 4.</span></div><div><span>age is 2.</span></div>" );

    
    //TODO bind-in
    
    //TODO in-bind
    
    
    
});

test( "escapeHTML", function() {
    expect( 1 );
    equal($( "#ren" ).render( "<p>${name}</p>"+
                                                 "<p>${list[0]}</p>"+
                                                 "<p>${map.name}</p>"+
                                                 "<p data-render='${list}.each'>$val</p>"+
                                                 "<p data-render='${map}.each'>$val</p>", escapeHTML ).html(),
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>"+
                                                "<p>&lt;span&gt;\"&amp;\"&lt;/span&gt;</p>");
});
test( "raw", function() {
    expect( 1 );
    equal($( "#ren" ).render( "<p>$r{name}</p>"+
                                                 "<p>$r{list[0]}</p>"+
                                                 "<p>$r{map.name}</p>"+
                                                 "<p data-render='${list}.each'>$rval</p>"+
                                                 "<p data-render='${map}.each'>$rval</p>", raw )[0].innerHTML,
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
            equal( $("#ren").html() ,"<div><p>name is Amber.</p><p>age is 4.</p><p>type is mix.</p></div>" );
            start();
        }
    },map);
    
} );


asyncTest( "include", function(){
    expect( 1 );
    $("#ren").render({
        url : "include/index.ren",
        success : function(){
            equal( $("#ren").html(),
                "<div>\n"+
                "    <header><p>this is Header!!</p></header>\n"+
                "    <div class=\"body\"><div class=\"item\">this is Amber!!</div></div>\n"+
                "    <footer><p>this is Footer!!</p></footer>\n"+
                "</div>");
            start();
        }
    },map);
});

asyncTest("word-setting-en", function(){
    expect( 1 );
    
    $.word( {
        en : "word.en",
        ja : "word.ja"
    } , "en", "en",function(){
	    $("#ren").render({
	        url : "word.ren",
	        success : function(){
	            equal( $("#ren").html(), 
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
	            equal( $("#ren").html(), 
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
            equal( $("#ren").html(), 
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
            equal( $("#ren").html(), 
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
            // equal( $("#ren").html(),
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
   equal( val, "123" );
});


}( jQuery ) );