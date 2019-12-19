const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
		const authHeader = await req.get('Authorization');
		if (authHeader) {
			const token = await authHeader.split(' ')[1];
			let decodedToken = jwt.verify(token, process.env.JWT_KEY);
			if (decodedToken) {
				req.isAuth = true;
				req.userId = decodedToken.userId;
				next();
			}
		} else {
			req.isAuth = false;
			return next();
		}
	} catch (err) { return err; }
}