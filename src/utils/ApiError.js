class ApiError extends Error{
    constructor(
        statusCode,     //http status code
        message = "Something went wrong.." , //do not prefer this message in production level code
        errors= [] , //addition error datils
        stack = "" //stack trace
    ){  
        super(message)      //parent Error constuctor
        this.statusCode = statusCode //http status code
        this.data = null                //Since this is an error response, there usually isn't useful data to return
        this.success = false
        this.message= message           
        this.errors=errors

        //A stack trace tells you where the error happened This is extremely useful for debugging
        if(stack){
            this.stack = stack  //stack trace
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}