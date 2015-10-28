function start(slowFunc){        
    //making the queue object
    var queue = {                
        stack: [],
        response: null,
        flushing: false,
        then: function then(f){
            if(this.flushing){
                f(this.response);
            }
            else{
                this.stack.push(f);
            }
            return this;
        },
        flush: function flush(r){
            if(this.flushing){return;}
            this.response = r;
            this.flushing = true;
            while(this.stack[0]){
                this.stack.shift()(this.response);                       
            }
        },
        start: this.start,
    };//--END of queue object
    if(arguments[0])slowFunc(queue); //using the queue: slowFunc should flush q at the end
    
    return queue; //returning the queue
}//--END of chain function--
var chain = {};
chain.start = start;
//------------------------------------------
function group1(q){
  test("Wait 3 seconds for next test", function(){
    assert(3<4,"3<4");    
  });
  setTimeout(()=>{  
   q.flush("Delayed message.");
  },3000);
}
//--------------------
function group2(r){
 test("This test is delayed by the one above",()=>{
  deep(1,true,"1 is not true.");
 });
}
//-------------------------

function group3(){
  chain
    .start(group1)
    .then(group2)
  ;
}
//-------------------------
group3();

//$.get('modules/require.js', (r)=>{$('#bottom').html(r)});
//$.get('modules/aQuery.js', (r)=>{$('#bottom').html(r)});
//$.get('main.js', (r)=>{$('#bottom').html(r)});




