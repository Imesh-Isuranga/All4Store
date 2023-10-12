export default {
    oidc:{
        clientId:'{YourClientId}',
        issuer:'https://{YourOktaDomain}/oauth2/default',
        redirectUri:'http://localhost:4200/login/callback',
        scopes:['openid','profile','email']
    }
}
