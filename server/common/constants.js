module.exports = {
    roles: {
        administrator: 'administrator',
        moderator: 'moderator',
        regular: 'regular'
    },
    securityHeader : {
        name: 'X-Auth',
        value: 'middleware'
    },
    query: {
        defaultPage: 1,
        defaultSize: 10,
        users : {
            by : 'username',
            possibleFields: ['username', 'dateRegistered', 'level', 'respect']
        },
        maps: {
            by: 'name',
            possibleFields: ['name', 'date', 'damageToTake']
        }
    },
    cookieHours: 24,
    models: {
        minLength: 3,
        minLengthPass: 10,
        minLengthPrizes: 5,
        user :{
            defaultMoney: 2000,
            defaultLevel: 1,
            defaultRespect: 0
        }
    },
    objectIdPattern: /[0-9A-Fa-f]{24}/
};