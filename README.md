# core-auth-oauth2
Authentication service using cognito

## Serverless Deployment
1. Create `config/env/.dev-sls.json` and `config/env/.prod-sls.json` file with following data (the values are depending on your environment)
```json
{
  "baseUrl": "http://localhost:3000",
  "postgres": {
    "host": "postgres",
    "port": 5432,
    "database": "authservice",
    "username": "postgres",
    "password": "postgres"
  },
  "userRoles": {
    "roles": ["ADMIN"],
    "defaultsTo": "ADMIN"
  },
  "auth0": {
    "domain": "**********.auth0.com",
    "clientID": "**************",
    "clientSecret": "************"
  },
  "cognito": {
    "clientDomain": "**********",
    "clientID": "**********",
    "clientSecret": "************",
    "region": "us-east-1",
    "userPoolId": "*************"
  }
}
```
2. Install dependencies with `npm install`
3. Deploy to aws: `sls deploy -s dev` or `sls deploy -s prod`
4. Get the API gateway URL from output

## Docker Deployment
1. Create `config/env/.local.json` file with following data

```json
{
  "baseUrl": "http://localhost:3000",
  "postgres": {
    "host": "postgres",
    "port": 5432,
    "database": "authservice",
    "username": "postgres",
    "password": "postgres"
  },
  "userRoles": {
    "roles": ["ADMIN"],
    "defaultsTo": "ADMIN"
  },
  "auth0": {
    "domain": "**********.auth0.com",
    "clientID": "**************",
    "clientSecret": "************"
  },
  "cognito": {
    "clientDomain": "**********",
    "clientID": "**********",
    "clientSecret": "************",
    "region": "us-east-1",
    "userPoolId": "*************"
  }
}
```

2. Run `docker-compose -f compose.yml up -d`
3. Setup proxy to point to this server at port 3000

## Development

Same as above, but run `docker-compose up -d` instead, this will create 2 services (postgres for DB and app for the core-auth app)


# Usage flow
1. Setup oauth2 client based on provider documention (either auth0 nor cognito are supported)
2. On login success, call `post /connect/{provider}` for register user from provider to our system
3. Using `idToken` returns from previous step as a bearer token to call other APIs

**Note:** See `public/index.html` for example flow

# APIs

## Users

### User profile
- Route `GET /profile` with header:
```
Authorization: Bearer the_jwt_token
```

Response:
```js
{
  me: { id: 'uuid', firstName: 'user first name', lastName: 'user last name', email: 'useremail' }
}
```

### Register new user from cognito
- Use `amazon-cognito-auth` to authenticate and get the accessToken, idToken. Please see `public/cognito.html` for vanillajs example
- Post the accessToken to `post /connect/cognito` with payload: `{accessToken: '********', idToken: '********', role: 'ADMIN'}`


### Register new user from auth0
- Use auth0 SDK to authenticate and get the accessToken, idToken (https://auth0.com/docs/quickstart). Please see `public/auth0.html` for vanillajs example
- Post the accessToken to `post /connect/auth0` with payload: `{accessToken: '********', idToken: '********', role: 'ADMIN'}`
