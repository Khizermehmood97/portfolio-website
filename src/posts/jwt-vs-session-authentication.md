---
title: "JWT vs Session Authentication: A Deep Dive"
date: "2025-04-10"
excerpt: "Sessions ruled the web for decades — then distributed systems broke them. Here's exactly how sessions work, why they struggled at scale, how JWT fixed it, and where you should store your tokens."
tags: ["Security", "JWT", "Authentication", ".NET", "Web"]
cover: "/blog/jwt-vs-session.jpg"
---

Authentication is one of those topics every developer touches early and revisits constantly. For decades, session-based auth was the default. Then modern architectures — microservices, mobile apps, multi-origin APIs — exposed its cracks. JWT emerged as the answer. But JWT isn't a silver bullet either, and where you store your token matters enormously.

This post covers both mechanisms in depth: how they work, why sessions struggled, how JWT fixed those problems, and a full breakdown of every browser storage option with real trade-offs.

---

## Part 1 — Session-Based Authentication

### How It Works

Session-based auth is **stateful** — the server remembers you. Here's the complete flow:

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SESSION-BASED AUTH FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

  Browser                 Web Server              Session Store (Redis/DB)
     │                        │                          │
     │  POST /login            │                          │
     │  { email, password }    │                          │
     │ ───────────────────────>│                          │
     │                        │  Validate credentials     │
     │                        │ ────────────────────────> │
     │                        │ <─── User record ─────── │
     │                        │                          │
     │                        │  Create Session          │
     │                        │  sessionId = "a3f9..."   │
     │                        │  Store { userId, roles,  │
     │                        │    expiry } in store     │
     │                        │ ────────────────────────>│
     │                        │                          │
     │  HTTP 200              │                          │
     │  Set-Cookie:           │                          │
     │  sessionId=a3f9...;    │                          │
     │  HttpOnly; Secure      │                          │
     │ <─────────────────────-│                          │
     │                        │                          │
     │  (User navigates)      │                          │
     │                        │                          │
     │  GET /dashboard        │                          │
     │  Cookie: sessionId=    │                          │
     │          a3f9...       │                          │
     │ ───────────────────────>│                          │
     │                        │  Look up sessionId       │
     │                        │ ────────────────────────>│
     │                        │ <── Session data ──────  │
     │                        │    { userId: 42,         │
     │                        │      roles: ["admin"] }  │
     │                        │                          │
     │  HTTP 200 /dashboard   │                          │
     │ <─────────────────────-│                          │
     │                        │                          │
     │  POST /logout           │                          │
     │ ───────────────────────>│                          │
     │                        │  Delete session          │
     │                        │ ────────────────────────>│
     │  Clear cookie          │                          │
     │ <─────────────────────-│                          │
```

**What's happening at each step:**

1. User submits credentials
2. Server validates against the database
3. Server creates a **session record** in a store (memory, Redis, or DB) — keyed by a random session ID
4. Server sends the session ID back as an **HttpOnly cookie**
5. On every subsequent request, the browser automatically includes the cookie
6. Server **looks up** the session ID in the store on every request to identify the user
7. Logout physically **deletes** the session record — the user is immediately unauthenticated

### Session Implementation in .NET Core

```csharp
// Program.cs
builder.Services.AddDistributedMemoryCache(); // or AddStackExchangeRedisCache()
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

app.UseSession();

// AuthController.cs
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    var user = _userService.Validate(request.Email, request.Password);
    if (user is null) return Unauthorized();

    HttpContext.Session.SetInt32("UserId", user.Id);
    HttpContext.Session.SetString("Role", user.Role);
    return Ok(new { message = "Logged in" });
}

[HttpGet("profile")]
public IActionResult Profile()
{
    var userId = HttpContext.Session.GetInt32("UserId");
    if (userId is null) return Unauthorized();
    // fetch and return user
}

[HttpPost("logout")]
public IActionResult Logout()
{
    HttpContext.Session.Clear(); // deletes the session record
    return Ok();
}
```

---

## Part 2 — The Problems with Sessions

Sessions worked fine when every app was a single server talking to a single database. Modern infrastructure broke that assumption in several important ways.

### Problem 1 — Horizontal Scaling (The Big One)

Imagine your app runs on three servers behind a load balancer:

```
                    ┌──────────────────────┐
                    │    Load Balancer      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼────┐    ┌──────▼───┐    ┌──────▼────┐
        │ Server A  │    │ Server B  │    │ Server C  │
        │ Session:  │    │ Session:  │    │ Session:  │
        │ a3f9=42   │    │  (empty)  │    │  (empty)  │
        └───────────┘    └───────────┘    └───────────┘
```

User logs in via **Server A** — session `a3f9` is stored in A's memory.  
Next request routes to **Server B** — B has no record of `a3f9` → user is logged out.

**Solutions (all have costs):**
- **Sticky sessions** — pin a user to one server. Defeats the purpose of load balancing.
- **Centralised session store** (Redis) — adds an infrastructure dependency and a network hop on every request.
- **Database sessions** — even slower; every request hits the DB just to validate identity.

### Problem 2 — Memory Pressure

Each logged-in user occupies memory on the server. With 100,000 concurrent users, in-memory sessions become a significant resource problem. Even with Redis, each session is a stored object with TTL management overhead.

### Problem 3 — Cross-Origin Requests (CORS + Cookies)

Modern applications routinely talk across origins:
- Frontend: `app.company.com`
- API: `api.company.com`
- Mobile app → `api.company.com`

Cookies carry automatic browser restrictions. `SameSite=Strict` blocks them on cross-origin requests entirely. `SameSite=None` requires `Secure` and opens CSRF vectors. Mobile apps have no cookie jar at all.

### Problem 4 — Microservices

In a microservice architecture, your API gateway may validate the session — but now the Order Service, Inventory Service, and Notification Service all need user context. Do they each query the session store? Do you propagate the session ID between services? Neither answer is clean.

### Problem 5 — CSRF Vulnerability

Because cookies are sent automatically by the browser with every request to the matching domain, they are inherently vulnerable to **Cross-Site Request Forgery (CSRF)**. An attacker can host a malicious page that triggers requests to your API — the victim's browser happily attaches their session cookie.

Mitigation requires CSRF tokens, `SameSite` directives, and `Origin` header validation — extra complexity your team has to maintain.

---

## Part 3 — JSON Web Tokens (JWT)

### What Is a JWT?

A JWT is a **self-contained**, **cryptographically signed** token that carries user identity and claims directly inside it. The server does not need to store anything.

A JWT has three parts, dot-separated:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (Base64URL)
.
eyJzdWIiOiI0MiIsIm5hbWUiOiJLaGl6ZXIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTE5NzYwMDB9  ← Payload (Base64URL)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (HMAC-SHA256 or RSA)
```

**Decoded header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Decoded payload:**
```json
{
  "sub": "42",
  "name": "Khizer Mehmood",
  "role": "admin",
  "iat": 1711889600,
  "exp": 1711976000
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

The signature is what makes JWT trustworthy. Without the server's secret key, nobody can forge a valid token. If an attacker tampers with the payload (e.g., changes `"role": "user"` to `"role": "admin"`), the signature won't match and the server rejects it.

> **Important:** The payload is Base64URL *encoded*, not *encrypted*. Anyone can decode it and read the claims. Never put passwords, PII, or sensitive data in a JWT payload unless you use JWE (JSON Web Encryption).

---

## Part 4 — The JWT Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JWT AUTH FLOW                                     │
└─────────────────────────────────────────────────────────────────────┘

  Browser / Mobile         Auth Server              Resource Server
        │                       │                         │
        │  POST /auth/login      │                         │
        │  { email, password }   │                         │
        │ ──────────────────────>│                         │
        │                       │  Validate credentials   │
        │                       │  (DB lookup, once)      │
        │                       │                         │
        │                       │  Sign JWT               │
        │                       │  { sub, role, exp }     │
        │                       │  with SECRET_KEY        │
        │                       │                         │
        │  HTTP 200              │                         │
        │  { accessToken,        │                         │
        │    refreshToken }      │                         │
        │ <──────────────────────│                         │
        │                       │                         │
        │  (Store token          │                         │
        │   client-side)         │                         │
        │                       │                         │
        │  GET /api/orders       │                         │
        │  Authorization:        │                         │
        │  Bearer eyJhbGci...    │                         │
        │ ───────────────────────────────────────────────>│
        │                       │                         │  Verify
        │                       │                         │  signature
        │                       │                         │  (no DB call)
        │                       │                         │
        │  HTTP 200 { orders }   │                         │
        │ <───────────────────────────────────────────────│
        │                       │                         │
        │  (Token expires)       │                         │
        │                       │                         │
        │  POST /auth/refresh    │                         │
        │  { refreshToken }      │                         │
        │ ──────────────────────>│                         │
        │                       │  Validate refresh token │
        │                       │  (checks DB/store)      │
        │                       │  Issue new access token │
        │                       │                         │
        │  { accessToken }       │                         │
        │ <──────────────────────│                         │
```

**Key difference from sessions:** The Resource Server validates the token **purely by verifying the cryptographic signature** — no database lookup, no network call to a session store. This is what makes JWT stateless.

### JWT Implementation in .NET Core

```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ClockSkew                = TimeSpan.Zero // no grace period on expiry
        };
    });

// TokenService.cs
public string GenerateAccessToken(User user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    };

    var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer:             _config["Jwt:Issuer"],
        audience:           _config["Jwt:Audience"],
        claims:             claims,
        expires:            DateTime.UtcNow.AddMinutes(15), // short-lived!
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest req)
{
    var user = await _userService.ValidateAsync(req.Email, req.Password);
    if (user is null) return Unauthorized();

    var accessToken  = _tokenService.GenerateAccessToken(user);
    var refreshToken = _tokenService.GenerateRefreshToken(); // opaque random string

    // Store refresh token hash in DB with userId + expiry
    await _tokenService.SaveRefreshTokenAsync(user.Id, refreshToken);

    return Ok(new { accessToken, refreshToken });
}

[Authorize]
[HttpGet("me")]
public IActionResult Me()
{
    var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
    var role   = User.FindFirstValue(ClaimTypes.Role);
    return Ok(new { userId, role });
}
```

---

## Part 5 — Access Tokens vs Refresh Tokens

Because JWTs are stateless, they **cannot be revoked** after issuance (unlike sessions, which can just be deleted). This creates a dilemma: a long-lived JWT is a liability if stolen. The solution is the **dual-token pattern**.

```
┌──────────────────────────────────────────────────────────────────┐
│  ACCESS TOKEN          │  REFRESH TOKEN                          │
├──────────────────────────────────────────────────────────────────┤
│  Short-lived (5–15m)   │  Long-lived (7–30 days)                 │
│  Sent on every request │  Sent ONLY to /auth/refresh             │
│  Stateless (no DB)     │  Stateful (stored in DB)                │
│  Lives in memory/      │  Lives in HttpOnly cookie               │
│  HttpOnly cookie        │  or secure storage                     │
│  Carries user claims   │  Opaque random string (no claims)       │
└──────────────────────────────────────────────────────────────────┘
```

If an access token is stolen, it expires in minutes. The refresh token sits in an HttpOnly cookie or secure store, used only for token rotation — much harder to steal.

---

## Part 6 — Where to Store JWT in the Browser

This is where most teams make mistakes. You have four main options.

### Option 1 — localStorage

```javascript
// Store
localStorage.setItem('accessToken', token)

// Retrieve
const token = localStorage.getItem('accessToken')

// Use in requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Remove on logout
localStorage.removeItem('accessToken')
```

**Pros:**
- Simple API, persists across browser tabs and sessions
- Survives page reloads and browser restarts
- Works across tabs automatically

**Cons:**
- **XSS vulnerability** — any JavaScript on your page can read it. If an attacker injects a script (via a dependency, a CDN compromise, or a stored XSS in user content), they can do `localStorage.getItem('accessToken')` and exfiltrate the token silently
- Not suitable for refresh tokens or long-lived sensitive tokens

**Verdict:** Acceptable for short-lived access tokens in low-risk SPAs. Never use for refresh tokens.

---

### Option 2 — sessionStorage

```javascript
// Store
sessionStorage.setItem('accessToken', token)

// Same API as localStorage
const token = sessionStorage.getItem('accessToken')
```

**Pros:**
- Cleared automatically when the browser tab is closed
- Isolated per tab — opening a new tab does not share the token

**Cons:**
- Same XSS vulnerability as localStorage (JavaScript can still read it)
- Users must log in again after closing the tab — poor UX for most apps
- Opening a link in a new tab logs the user out of that tab

**Verdict:** Use when "session ends when tab closes" matches your security requirements (e.g., banking).

---

### Option 3 — In-Memory (JavaScript variable)

```javascript
// auth.js — module-level variable
let accessToken = null

export function setToken(token) {
  accessToken = token
}

export function getToken() {
  return accessToken
}

export function clearToken() {
  accessToken = null
}

// React example with a context/store
const [accessToken, setAccessToken] = useState(null)

// After login:
setAccessToken(response.data.accessToken)

// Axios interceptor:
axios.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})
```

**Pros:**
- **Most secure against XSS** — there is no persistent DOM or storage API to read; a script injection would need to intercept your specific module scope, which is significantly harder
- Token is gone the moment the page refreshes — minimises exposure window
- Cannot be read by browser extensions

**Cons:**
- Lost on every page refresh — requires a silent re-authentication mechanism (the refresh token in an HttpOnly cookie handles this)
- More complex to implement correctly
- Memory is shared in the same JavaScript context — a `window.onload` script replacement or prototype pollution could still reach it in theory

**Verdict:** The recommended option for access tokens in high-security SPAs. Pair with a refresh token in an HttpOnly cookie.

---

### Option 4 — HttpOnly Cookie

```csharp
// Server sets the cookie — client JavaScript never touches it
Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
{
    HttpOnly  = true,        // JS cannot read this
    Secure    = true,        // HTTPS only
    SameSite  = SameSiteMode.Strict, // CSRF protection
    Expires   = DateTimeOffset.UtcNow.AddDays(30),
    Path      = "/auth/refresh" // only sent to this endpoint
});
```

```javascript
// Client — you never touch this cookie in JS at all
// It is sent automatically by the browser to /auth/refresh

// Silent refresh implementation:
async function silentRefresh() {
  try {
    const response = await axios.post('/auth/refresh', {}, {
      withCredentials: true // allows the cookie to be sent cross-origin
    })
    setAccessToken(response.data.accessToken) // store access token in memory
  } catch {
    clearToken() // refresh token expired or rotated — user must log in
  }
}
```

**Pros:**
- **Immune to XSS** — the `HttpOnly` flag prevents any JavaScript from reading it, including injected scripts
- Sent automatically by the browser — no code needed to attach it
- `SameSite=Strict` makes it immune to CSRF attacks on the refresh endpoint
- Scoped to a specific path (e.g., `/auth/refresh`) — not sent on every API request

**Cons:**
- CSRF concerns if `SameSite` is not set correctly
- More complex server-side handling (cookie management, rotation)
- Mobile apps / non-browser clients cannot use cookies naturally
- Cross-origin cookie sharing requires careful `SameSite` and CORS configuration

**Verdict:** The gold standard for storing refresh tokens. The server sets it, the server reads it — JavaScript never touches it.

---

### Storage Method Comparison

| Method | XSS Risk | CSRF Risk | Persists Reload | Mobile Support | Complexity |
|---|---|---|---|---|---|
| localStorage | High | None | Yes | N/A | Low |
| sessionStorage | High | None | No (tab close) | N/A | Low |
| In-memory (JS) | Low | None | No | N/A | Medium |
| HttpOnly Cookie | None | Medium* | Yes | Poor | High |

*\* Mitigated by `SameSite=Strict` and CSRF tokens.*

---

## Part 7 — The Recommended Pattern

The industry-standard approach for SPAs combines the best of all options:

```
┌─────────────────────────────────────────────────────────────────────┐
│           RECOMMENDED DUAL-TOKEN STORAGE PATTERN                    │
└─────────────────────────────────────────────────────────────────────┘

  Browser (SPA)               Server
       │                         │
       │  POST /auth/login        │
       │  { email, password }     │
       │ ───────────────────────>│
       │                         │  ┌─────────────────────────────┐
       │                         │  │ Generate:                   │
       │                         │  │  accessToken  (15 min JWT)  │
       │                         │  │  refreshToken (30 day opaque│
       │                         │  │    random string)           │
       │                         │  └─────────────────────────────┘
       │                         │
       │  200 { accessToken }     │  Set-Cookie: refreshToken=...
       │  + HttpOnly cookie       │  HttpOnly; Secure; SameSite=Strict
       │ <──────────────────────-│  Path=/auth/refresh
       │                         │
       │  Store accessToken in   │
       │  memory (React state)   │
       │                         │
       │  GET /api/data          │
       │  Authorization:         │
       │  Bearer <accessToken>   │
       │ ───────────────────────>│  Verify JWT signature only
       │  200 { data }           │  No DB call
       │ <──────────────────────-│
       │                         │
       │  (15 min later —        │
       │   token expired)        │
       │                         │
       │  POST /auth/refresh     │
       │  [cookie sent auto]     │
       │ ───────────────────────>│  Validate refresh token in DB
       │                         │  Rotate: invalidate old, issue new
       │  200 { accessToken }    │  Set-Cookie: new refreshToken
       │ <──────────────────────-│
       │                         │
       │  Update in-memory       │
       │  access token           │
       │                         │
       │  POST /auth/logout      │
       │  [cookie sent auto]     │
       │ ───────────────────────>│  Delete refresh token from DB
       │                         │  Clear cookie
       │  Clear memory token     │
       │ <──────────────────────-│
```

**Summary of the pattern:**
- **Access token** → stored in JavaScript memory (React state / Zustand / module variable). Short-lived, used in `Authorization: Bearer` header
- **Refresh token** → stored in `HttpOnly; Secure; SameSite=Strict` cookie. Long-lived, used only at `/auth/refresh`
- **On page load** → call `/auth/refresh` silently to restore the in-memory access token if the user has a valid session

---

## Part 8 — Sessions vs JWT: Head-to-Head

| Concern | Sessions | JWT |
|---|---|---|
| **State** | Stateful (server stores session) | Stateless (token carries all data) |
| **Scalability** | Requires shared session store for multiple servers | No shared store needed |
| **Performance** | DB/Redis lookup on every request | Signature verification only (CPU, no I/O) |
| **Revocation** | Instant — delete the session record | Impossible until expiry (mitigated by short TTL) |
| **Logout** | Immediate and guaranteed | Access token stays valid until expiry |
| **Mobile Support** | Poor (no cookie jar) | Excellent (token in header) |
| **Microservices** | Requires propagating session context | Token is self-contained, any service can verify |
| **Payload** | Stored server-side (can be large) | Sent on every request (keep it small) |
| **CSRF** | Vulnerable by default | Not vulnerable (tokens in headers, not cookies) |
| **XSS** | Cookie is HttpOnly by default | Depends entirely on where you store the token |

---

## Part 9 — When to Choose Which

**Use sessions when:**
- You need immediate, guaranteed logout (banking, healthcare, admin portals)
- You're building a traditional server-rendered app (MVC, Razor Pages)
- Your entire stack runs on a single server or you already have Redis
- You want the simplest possible implementation

**Use JWT when:**
- You're building an SPA or mobile app consuming a separate API
- Your API serves multiple clients (web, iOS, Android, third-party)
- You need horizontal scalability without a session store
- You're building microservices and need to propagate identity between services
- You're implementing SSO across multiple domains

---

## Part 10 — Common JWT Mistakes to Avoid

**1. Using `alg: none`**
```json
{ "alg": "none", "typ": "JWT" }
```
Some early JWT libraries accepted unsigned tokens if `alg` was set to `none`. Always explicitly reject this algorithm on the server.

**2. Using a weak or predictable secret**
```bash
# Bad
Jwt__Secret=secret123

# Good — 256+ bits of random entropy
Jwt__Secret=K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

**3. Storing the JWT in localStorage and never rotating**
A stolen JWT from localStorage is valid until expiry. With a 24-hour expiry and no rotation, an attacker has a 24-hour window.

**4. Putting sensitive data in the payload**
The payload is Base64URL encoded — not encrypted. `jwt.io` can decode any JWT instantly. Don't put emails, SSNs, or secrets in it.

**5. Skipping token rotation on refresh**
Every time a refresh token is used, invalidate it and issue a new one. This way, if a refresh token is stolen and used, your legitimate user's next refresh will detect the conflict.

---

## Conclusion

Session-based auth isn't broken — it's a perfectly valid choice for many applications. Its Achilles' heel is state: storing sessions server-side creates coupling between your servers that becomes painful at scale.

JWT moves that state into the token itself, making it self-contained and scalable by design. The trade-off is that you lose instant revocation, which you compensate for with short expiry windows and the refresh token rotation pattern.

The biggest decision JWT introduces is **where to store the token**. The answer: keep your access token in JavaScript memory (ephemeral, XSS-safe) and your refresh token in an HttpOnly cookie (persistent, also XSS-safe). Anything else is a compromise.

Get the storage right, keep access tokens short-lived, rotate refresh tokens on every use — and JWT is a rock-solid foundation for modern authentication.
