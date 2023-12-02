const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const DatabaseInstance = require("../database/Database");

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(function verify(username, password, done) {
			const db = DatabaseInstance.getInstance();
			const query = `SELECT * FROM login WHERE username=$1`;

			try {
				db.queryDbValues(query, [username]).then((data) => {
					if (data.length == 0) {
						return done(null, false, {
							message: "No accounts with that username found.",
						});
					}

					bcrypt.compare(password, data[0].password, (err, result) => {
						if (err) {
							return done(err);
						}

						if (!result) {
							return done(null, false, { message: "Incorrect password." });
						}

						return done(null, data[0]);
					});
				});
			} catch (err) {
				return done(err);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.username);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const db = DatabaseInstance.getInstance();

			const query = `SELECT * FROM login WHERE username=$1`;
			const data = await db.queryDbValues(query, [id]);
			if (data.length == 0) {
				return done(null, false, {
					message: "No accounts with that username found.",
				});
			}

			return done(null, data[0]);
		} catch (err) {
			done(err, false); // In case of an error
		}
	});
};
