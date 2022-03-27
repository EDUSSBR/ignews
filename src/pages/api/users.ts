import { NextApiRequest, NextApiResponse } from "next"
// JWT (Storage)
//Next Auth (Social)
// Cognito(aws), Auth0 (externos) também integram com Next Auth (Authentication as a service)
export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1,  name: 'Eduardo'},
        { id: 2,  name: 'Bruna'},
        { id: 3,  name: 'Matheus'},
    ]
    return response.json(users)
}


