/**========A commonJS-like module called chain.js================================================================
    Make an object (chain) that provides a way for functions to be chained
    after calling an asynchronous function on which they depend.
    Example: func1 and func2 depend on the result of asychFunc, so ...
    
        chain.start(asynchFunc).then(func1).then(func2);
    
    The requirements of the functions to use this api:
        1. The slow asynchronous function is passed as a callback to chain's start method
           The asych function must be defined using one formal parameter passed to it. This parameter,
           call it 'q', is used to "open the floodgates" of queue-ed up functions to be flushed
           from the queue, passing its result data to them like this:
           
                function slowAsynchFunction(q){
                    var result = null;
                    
                    //do all the slow asynch suff here.
                    //when done, put the resulting data in to the result varaible
                    //and call q;s flush function with the result as the arguments
                    
                    result = realResultData;
                    q.flush(result);
                }
                
        2.  The dependent functions that follow the asynch functions are defined 
            with no formal parameters, but the asynch's result data is made available
            as the initial member if the 'arguments' object:
            
                function dependentFunction(result){
                    var neededResult = result;
                    //use neededResult as needed
                }
        3. Now, chain them like this:
        
            chain.start(slowAsyncFunc1)
                .then(depFunc1a)
                .then(depFunc1b)
                .start(slowAsyncFunc12)
                .then(depFunc2a)
                .then(depFunc2b)
            ;//done           
            
    Clued in by Dustin Diaz: http://www.dustindiaz.com/async-method-queues/
*/
//-------------------------------------------------------------
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
exports.start;