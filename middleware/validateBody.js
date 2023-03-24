const { httpError } = require("../helpers");

const validation = schema => {
    const func = (req, _, next)=> {
        const { error } = schema.validate(req.body);
        if (error) {
            next(httpError(400, error.message));
        }
        next()
    }

    return func;
  };


module.exports =  validation ;
