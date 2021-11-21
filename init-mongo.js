db.createUser(
    {
        user: 'dbuser',
        pwd: 'thisissecret',
        roles: [
            {
                role: 'readWrite',
                db: 'Todo'
            }
        ]
    }
)