# Database Structure

## Data

**Legend:**

- (v) = Versioned

- User
  - ID
  - Account type
  - Display name (v)
  - Email (v)
    - Verified?
  - Password hash (v)
  - SSO tokens?
- Challenge
  - ID
  - Name (v)
  - Author ID

## Access Patterns

### Home

### Signup

- Does account with email exist?
  - Input:
    - Email
- Create account
  - Input:
    - Email
    - SSO tokens?
    - Password
    - Display name
- Login
  - Input:
    - Email
    - SSO tokens?
    - Password hash
- Verify email
  - Input:
    - Email

### Challenges

- List current challenges
- Search challenges
  - Use Elasticsearch

### Create Challenge

-
