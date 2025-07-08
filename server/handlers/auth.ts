import express from 'express'

const router = express.Router();

router.get('/.well-known/oauth-authorization-server', function (req, res) {
    const result = {
        "issuer": "https://accordproject.us.auth0.com/",
        "authorization_endpoint": "https://accordproject.us.auth0.com/authorize",
        "token_endpoint": "https://accordproject.us.auth0.com/oauth/token",
        "device_authorization_endpoint": "https://accordproject.us.auth0.com/oauth/device/code",
        "userinfo_endpoint": "https://accordproject.us.auth0.com/userinfo",
        "mfa_challenge_endpoint": "https://accordproject.us.auth0.com/mfa/challenge",
        "jwks_uri": "https://accordproject.us.auth0.com/.well-known/jwks.json",
        "registration_endpoint": "https://accordproject.us.auth0.com/oidc/register",
        "revocation_endpoint": "https://accordproject.us.auth0.com/oauth/revoke",
        "scopes_supported": ["openid", "profile", "offline_access", "name", "given_name", "family_name", "nickname", "email", "email_verified", "picture", "created_at", "identities", "phone", "address"],
        "response_types_supported": ["code", "token", "id_token", "code token", "code id_token", "token id_token", "code token id_token"],
        "code_challenge_methods_supported": ["S256", "plain"],
        "response_modes_supported": ["query", "fragment", "form_post"],
        "subject_types_supported": ["public"],
        "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "private_key_jwt", "tls_client_auth", "self_signed_tls_client_auth"],
        "claims_supported": ["aud", "auth_time", "created_at", "email", "email_verified", "exp", "family_name", "given_name", "iat", "identities", "iss", "name", "nickname", "phone_number", "picture", "sub"],
        "request_uri_parameter_supported": false,
        "request_parameter_supported": true,
        "id_token_signing_alg_values_supported": ["HS256", "RS256", "PS256"],
        "token_endpoint_auth_signing_alg_values_supported": ["RS256", "RS384", "PS256"],
        "tls_client_certificate_bound_access_tokens": true,
        "request_object_signing_alg_values_supported": ["RS256", "RS384", "PS256"],
        "backchannel_logout_supported": true,
        "backchannel_logout_session_supported": true,
        "end_session_endpoint": "https://accordproject.us.auth0.com/oidc/logout",
        "global_token_revocation_endpoint": "https://accordproject.us.auth0.com/oauth/global-token-revocation/connection/{connectionName}",
        "global_token_revocation_endpoint_auth_methods_supported": ["global-token-revocation+jwt"]
    };
    res.json(result);
});

export default router;
