/*
* Author: Abbas Abdulmalik
* Creation Date: October 22, 2015
* Revised: October 25, 2015
* Project Name: Unit tests - Sliding Windows (folder: utestslider)
* Purpose: (1.) adjust how much vertical space is used by
*   two verically stacked windows by sliding a thin partition
*   that separates them.
*          (2.) show unit test results in the bottom window
*   for JS code run in top window.
*   Note: the local aQuery module's makeDraggable() method was improved:
*   dragged element is npo longer prematurely dropped; very robust, but
*   a little problematic when dragged to the very top and bottom of the screen.
*/
//============================
var base = 'https://dl.dropboxusercontent.com/u/21142484/modules/';
var $ = require("aQuery");
var intro = "Test results go here.<br>Single assertions must run above test suites."
var minFont = 15;
var maxFont = 25;
var pixelSize = (function(){}); 
var lineBoundary = {};
var btnBoundary = {};
//---------------------------------------
window.onload = function(){//ridiculous!
    setTimeout(function(){
        $.on = $.listen;
        init();
        joinWindows();        
    },10);
    //----------------------------------
    $('#bottom').html(intro);
    //-------------------------
    $('#top').listen("dblclick", function(){
        $('#btn').element.click(); //same as clicking thr run button       
    });
    //--------Button event handlers----------------
    $('#top').element.focus();
    $('#btn')
        .listen("click",function(){
            $('#bottom').html(""); //clear the bottom first.
            var ol = document.createElement('ol');
            ol.setAttribute('id','testList');
            $('#bottom').element.appendChild(ol);    
            //---------------------------
            //interpret and run the code in the top window when btn is clicked
            (function(){
                try{
                    var codeString = $('#top').element.innerHTML;
                    //alert("BEFORE:\n"+codeString);                
                    codeString = htmlToJs(codeString);
                    //alert("AFTER:\n"+codeString);
                    var f = Function(codeString);
                    f();
                }catch(e){
                    error(e); //the error function is defined with unit test below
                }
            })();
        })
        .listen("focus", function(){
            $('#btn').setStyle('background','lightblue');
        })
        .listen("blur",function(){
            $('#btn').setStyle("background","lightgray");
        })
        .listen("mouseover", function(){
            $('#btn').setStyle('background','lightblue')
        })
        .listen("mouseout", function(){
            $('#btn').setStyle('background','lightgray')
        })
    ;
    //------------------------
    $('#btnFont')
    .listen("mouseover", ()=>{
        $('#btnFont').setStyle("opacity","0.5")
    })
    .listen("mouseout",()=>{
        $('#btnFont').setStyle("opacity","0")
    })
    .listen("click",()=>{
        minFont = 1* prompt("MINIMUM font size in pixels") || minFont;
        maxFont = 1* prompt("MAXIMUM font size in pixels") || maxFont;
        init();     
    })
    //------------------------
    $('#line').listen("mousemove", function(e){
        //e.stopPropagation();//keeps line centered horizontally 
        //e.preventDefault();
        joinWindows(e);
    });
    //------------------------------
    $('#line').listen("mouseover", joinWindows);
    $('#line').listen("click", joinWindows);    
    //------------------------------
    $('body').listen("mousemove", joinWindows);
    //------------------------------
    window.onresize = resizingActions;
    //-------------------------------
    window.addEventListener("load", function(e){
        //e.stopPropagation();//keeps line centered horizontally        
        joinWindows(e);
    });
    //-------------------------------
    $('#line').listen("mousedown", joinWindows);
    //-------------------------------     
    $('#line').listen("mouseout", function(e){
        joinWindows(e);  
    });
    //-------------------------------
    function resizingActions(e){
        //e.stopPropagation();//keeps line centered horizontally
        //by preventing draggable handlers position cursor 
        
        var btnBoundary = $('#btn').element.getBoundingClientRect();       
        $('#top').setStyle("padding-top",(btnBoundary.bottom + 10) + "px");
        joinWindows(e);
        $('#line').element.click();
        $('.btn').chainStyleClass("font-size",pix(12,22));        
    }
    //-------------------------------
    function joinWindows(e){
        //---------------------
        lineBoundary = $('#line').element.getBoundingClientRect(); 
        btnBoundary = $('#btn').element.getBoundingClientRect();
        //----------------------
        if ( lineBoundary.top <= btnBoundary.bottom) {
            $('#line')
                .setStyle("top", (btnBoundary.bottom + 2) + 'px');
        }
        if ( lineBoundary.bottom >= window.innerHeight ){
            $('#line')
                .setStyle("top", (lineBoundary.top - $('#line').element.clientHeight) +"px");
        }
        //------------------------
        //lineBoundary = $('#line').element.getBoundingClientRect();
        $('#top').setStyle
                ("bottom", (window.innerHeight - lineBoundary.top) + "px");
        $('#bottom').setStyle
                ("top", lineBoundary.bottom +"px");
        $('#line').chainStyles   //Keep the partition ("line") centered horizontally.
                    ("left","0")
                    ("right","0")
        ;
        //---------------------------
    }
    //===================================
    function init(){        
        pixelSize = $.liquidPixelFactory(320,1920);        
        //---------------------------
        $('#btn').element.blur();
        $('#top').element.focus();
        //---------------------------------------
      
        //--------set initial font size-------------- 
        $('body').setStyle("font-size", $.pix(pixelSize(minFont,maxFont)));
        $('.btn').chainStyleClass("font-size",pix(12,22));           
        //--------------set responsive font size--------
        window.removeEventListener("resize", resizer);  
        $('global').listen("resize", resizer);
        //-----end of setting responsive font size------        
        $('.slider')
            .chainStyleClass
                ("color","white")
                ("text-align","left")                
        ;
        $('#top').element.contentEditable = "true";
        $('#bottom').element.contentEditable = "true";        
        $('#top').setStyle("font-family","Courier New, Courier, monospace ;");
        //----------------------------------------------                
        $.makeDraggable($('#line').element)
            .chainStyles
                ("top",0.9*window.innerHeight/2 + "px" )
                ("left","0")
                ("right","0")
             ;
        //------------------------------
        setTimeout(function(){
            //---------------------------
            $('#btn').element.blur();
            $('#top').element.focus();
            //----------------------             
        },10);
        //------------------------------
    }//--END of init()----
    //-----------------------------
};//--END of window onload function
//----------------------
function showProperties(o, target){
    var props = [];
    for(var x in o){
        if(true){
            props.push(x + '<br>');  
        }
    }
    props.sort();
    for(var y of props){
        target.innerHTML += y;
    }
}
//--------------------------
function htmlToJs(string){
    var SPACE = " ";
    //-----------
    string = string.replace(/<br>/g,"\n");
    string = string.replace(/<\/div>/g,"\n");        
    string = string.replace(/<.+>/g,"");//empty string or space??
    string = string.replace(/&gt;/g,">");
    string = string.replace(/&lt;/g,"<");
    string = string.replace(/&equals;/g,"=");
    string = string.replace(/&#61;/g,"=");         
    string = string.replace(/&nbsp;/g,SPACE);                
    string = string.replace(/&.+;/g,SPACE);
    //-----------------
    return string;
}
//==================================
//=========UNIT TEST testing========
function deep(a,b,string){
  var msg = "";
  if(a === b){
    msg = "PASS:\u00A0";
    $.log(msg + string);
    showResults(msg, string, true);
 }
  else{
   msg = "FAIL:\u00A0";     
   $.log(msg  + string);
   showResults(msg, string, false);
 }
 return msg;
}
//---------------------------------------
var deepEqual = deep;
//----------------------------------------
var assert = function assert(boolean, string){
    
    var msg = "";      
    if(!!boolean == true){
        msg = "PASS:\u00A0";
        $.log(msg + string);
        showResults(msg,string,true);
    }
  else{
    msg = "FAIL:\u00A0";       
   $.log(msg + string);
   showResults(msg,string,false);
 }
 return msg;
};
//---------------------------------------------
var error = function(e){
   var msg = "";
   msg = "ERROR:\u00A0";       
   $.log(msg + e.toString());
   showResults(msg,e.toString(),false);
   return msg; 
}
//---------------------------------------------
function test (string, func){
  
 if(typeof string !== 'string'){
   $.log("Must supply a string as the first argument" +
           "\nof test describing the test.");
   return false;
 }
 else if(typeof func !== 'function') {
   $.log("Must supply a function as the 2nd argument" +
           "\nof test that runs the assertions.");
   return false;
 }
 else{

    $('#bottom').element.innerHTML += "|====== " + string + " ======|";
    //----------------------------------------
    $.log("\n");
    $.log("------------------");    
    $.log("|=== " + string + " ===|" );
    $.log("------------------");
    var ol = document.createElement('ol');
    ol.setAttribute('id','testList');
    $('#bottom').element.appendChild(ol);

    func();

    $('#bottom').element.innerHTML += "<br>";   
    $.log("------------------\n");
   
   return true;
 }
} 
 //------------------------------------------
 function showResults(msg, string, boolean){
  //=======before=====
    var arrayBefore = [];
    for (var x in window){
      if(window.hasOwnProperty(x)){
        arrayBefore.push(x);
      }
    }
  //============

   var li = document.createElement('li');
   var span = document.createElement('span');
   span.style.color = ((boolean)?'#8f8':'#f22');
   span.style.fontWeight = "bold";
   span.style.textShadow = '1px 1px 1px black';

   var text = document.createTextNode("\u00A0\u00A0\u00A0"+msg);//unicode for spaces
   span.appendChild(text);
   li.appendChild(span);
   li.innerHTML += (string);
    try{
        var ol = this.document.getElementsByTagName('ol');
        if(ol[ol.length-1].getAttribute('id') === "testList"){
           ol = ol[ol.length-1];
           ol.appendChild(li);
       }else{
         ol = ol[0];
         ol.appendChild(li);
       }
    }catch(e){
        alert("showResults says:\n" + e)
    }    

   //====...and After=====
   //very, VERY lame attempt to restore the original window properties
   setTimeout(function(){
        var arrayAfter = [];
        for (var x in window){
            if(window.hasOwnProperty(x)){
                arrayAfter.push(x);
            }
        }
        var diffArray = $.sym(arrayBefore,arrayAfter);//symDiff(arrayBefore,arrayAfter);
        diffArray.forEach(function(m){
            delete window[m];
        });
    },10);
   //==============
 }
//----------------------------------------------
function pix(x,y){
    return pixelSize(x,y) + "px";
}
//-----------------------------------------------
function resizer(){
    btnBoundary = $('#btn').element.getBoundingClientRect();
    $('#top').setStyle("padding-top",(btnBoundary.bottom + 10)+"px");
    $('body').setStyle("font-size",$.pix(pixelSize(minFont,maxFont)));
}
//=======================================
/*
test("Testing some assertions", function(){
  assert(3>4,"Three is greater than four.");
  assert( 0 == false, "Zero equals false.");
  deepEqual( 0, false, "Zero equals false.");
  assert(1==true, "1 (the number) equals true.");
  deepEqual(1, true, "1 (the number) equals true.");
  deepEqual(2+2 ,parseFloat('4',10),"2+2 equals parseFloat('4').");
});
*/