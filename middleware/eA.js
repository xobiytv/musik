
const eA = (req, res, next) => {
    if(req.isAuthenticated() ) {
        next();
    }
    else{
        req.flash("danger" , "iltimos Tizimga kiring");
        res.redirect('/login');
    }
}


module.exports = eA;

