

const page = req.query.page
const limit = req.query.limit

const startIndex = (page - 1) * limit
const endIndex = page * limit

const resutUsers = users.slice(startIndex, endIndex)