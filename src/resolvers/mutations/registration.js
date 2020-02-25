const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { UserNotFound } from "../../errors";

const JWT_SECRET = process.env.JWT_SECRET || 'selfserve-jwt-secret-*9731465629#'


async function login(parent, args, context) {

	const session = context.driver.session()
	const result = await session.run(`MATCH (u) WHERE u.emailID = '${args.emailID}' RETURN u as user`)
	await session.close()
	if(result.records.length <= 0){
		throw new UserNotFound({ message: "User Not found" });
	}else {
		let user =  result.records[0].get('user').properties
		const valid = await bcrypt.compare(args.password, user.password)
		if (!valid) {
			throw new UserNotFound({ message: "User Not found" });
		}
		delete user.password

		const token = jwt.sign({...user}, JWT_SECRET)
		return {
			token,
			user,
		}
	}
}

async function register(parent, args, context) {

	const session = context.driver.session()
	const result = await session.run(`MATCH (u) WHERE u.emailID = '${args.emailID}' RETURN u as user`)
	if(result.records.length <= 0){
		const hashed = await bcrypt.hash(args.password, 10)
		await session.run(`
			CREATE (u:User { emailID: '${args.emailID}', password: '${hashed}', eventRole: 'REQUESTOR' })
			RETURN u.emailID
		`)
		await session.close()
		return "Success"
		
	}else {
		await session.close()
		throw new UserNotFound({ message: "User Exists" });
	}
}

async function resetPassword(parent, args, context){
	const session = context.driver.session()
	const result = await session.run(`MATCH (u) WHERE u.emailID = '${args.emailID}' RETURN u as user`)
	if(result.records.length <= 0){
		await session.close()
		throw new UserNotFound({ message: "User Not found" });
	}else {
		let user =  result.records[0].get('user').properties
		const valid = await bcrypt.compare(args.old, user.password)
		if (!valid) {
			throw new UserNotFound({ message: "Wrong Password" });
		}else{
			const password = await bcrypt.hash(args.password, 10)
			await session.run(`
				MATCH (u) WHERE u.emailID = '${args.emailID}'
				SET u.password = '${password}'
				RETURN u
			`)
			await session.close()
			return "Success"
		}
	}
}

module.exports = {
    login,
    resetPassword,
    register
}