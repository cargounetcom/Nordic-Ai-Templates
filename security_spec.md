# Security Specification: Scandinavian Design Studio Zero-Trust Matrix

## 1. Data Invariants

1. **Role Access Bounds**: Standard `user` clients cannot access `/users` belonging to others, nor set themselves as `admin` under private profiles.
2. **Immutable Identity**: A user profile's `email`, `id`, and primary `createdAt`/`registeredAt` fields must remain unalterable after initial registration.
3. **Verified Authentication Requirement**: All write actions inside `/users`, `/feedbacks`, and `/waitlist` are bound to a verified identity.
4. **Validation Size Safeguards**: All text entries (feedback remarks, user names, waitlist addresses) are subject to rigorous size limits to protect against Denial of Wallet attacks.

---

## 2. The "Dirty Dozen" Spoof Payloads

Below are the 12 hypothetical payloads engineered to target vulnerabilities like identity spoofing, value poisoning, and privilege escalation:

### Payload 1: Privilege Escalation on Creation
* **Target Path**: `users/attacker_uid`
* **Vulnerability Target**: Setting self-assigned `admin` role directly on signup.
* **Malicious Payload**:
  ```json
  { "id": "attacker_uid", "name": "Fake Admin", "email": "evil@attacker.com", "role": "admin", "plan": "max", "registeredAt": "2026-06-02", "mrr": 499 }
  ```
* **Security Barrier**: `isValidUser()` checks that initial role registration defaults safely or verified separately.

### Payload 2: ID Poisoning Attack
* **Target Path**: `users/AVeryBigAndCorruptStringWithMoreThan128CharactersToBreakIndexingAndConsumeProjectQuota`
* **Vulnerability Target**: Resource depletion from oversized document keys.
* **Malicious Payload**:
  ```json
  { "id": "junk", "name": "A", "email": "a@b.com", "role": "user", "plan": "free", "registeredAt": "2026-06-02", "mrr": 20 }
  ```
* **Security Barrier**: `isValidId()` enforces string size boundaries.

### Payload 3: Role Bypass via Key Update
* **Target Path**: `users/some_user_id` (Updating an existing user)
* **Vulnerability Target**: Overwriting the role parameter to `admin`.
* **Malicious Payload**:
  ```json
  { "role": "admin" }
  ```
* **Security Barrier**: `affectedKeys().hasOnly(['name', 'plan'])` blocks role modifications.

### Payload 4: Submitting Anonymous Feedback
* **Target Path**: `feedbacks/fb-malicious` (Created without credentials)
* **Vulnerability Target**: Spammer flooding the review ledger.
* **Malicious Payload**:
  ```json
  { "id": "fb-malicious", "name": "Anonym", "rating": 5, "category": "General", "text": "Hacked", "timestamp": "2026-06-02" }
  ```
* **Security Barrier**: `isSignedIn() && request.auth.token.email_verified == true`.

### Payload 5: Poisoning Rating Threshold
* **Target Path**: `feedbacks/fb-toxic-rating`
* **Vulnerability Target**: Overriding rating bounds with negative or outlier integers.
* **Malicious Payload**:
  ```json
  { "id": "fb-toxic", "name": "Spammer", "rating": 999999, "category": "General", "text": "Overpowered rating", "timestamp": "2026-06-02" }
  ```
* **Security Barrier**: Mandatory rating constraint `incoming().rating >= 1 && incoming().rating <= 5`.

### Payload 6: Denial of Wallet Feedback String
* **Target Path**: `feedbacks/fb-bloat`
* **Vulnerability Target**: Uploading massive 5MB text block to inflate reading bills.
* **Malicious Payload**:
  ```json
  { "id": "fb-bloat", "name": "Heavy", "rating": 3, "category": "General", "text": "[Oversized 1MB padding ...]", "timestamp": "2026-06-02" }
  ```
* **Security Barrier**: `incoming().text.size() <= 2000` size checks.

### Payload 7: Overwriting Other Users' Profiles
* **Target Path**: `users/victim_uid`
* **Vulnerability Target**: Identity hijacking of VIP Swedish designers.
* **Malicious Payload**:
  ```json
  { "name": "Hijacked Identity", "plan": "max" }
  ```
* **Security Barrier**: `request.auth.uid == userId` validation block.

### Payload 8: Mutating Feedback Timestamps
* **Target Path**: `feedbacks/fb-time-hack`
* **Vulnerability Target**: Retroactive logging.
* **Malicious Payload**:
  ```json
  { "timestamp": "1994-01-01" }
  ```
* **Security Barrier**: Immutability controls or timestamp enforcement.

### Payload 9: Spoofing Submitter Email on Waitlist
* **Target Path**: `waitlist/wl-spoof`
* **Vulnerability Target**: Impersonating a VIP email address without matching credentials.
* **Malicious Payload**:
  ```json
  { "id": "wl-spoof", "name": "Hacker", "email": "vip-client@copenhagen.dk", "role": "studio" }
  ```
* **Security Barrier**: Verification rules checking email matching boundaries or auth.

### Payload 10: Injecting Outlier Plan Subscriptions
* **Target Path**: `users/my_uid`
* **Vulnerability Target**: Elevating subscription level with nonexistent values like "premium-unlimited".
* **Malicious Payload**:
  ```json
  { "plan": "ultra_vip_free_max" }
  ```
* **Security Barrier**: Type enums validation `incoming().plan in ['free', 'pro', 'max']`.

### Payload 11: Tampering MRR financials
* **Target Path**: `users/my_uid`
* **Vulnerability Target**: Reducing self-payment metrics or spoofing corporate revenue.
* **Malicious Payload**:
  ```json
  { "mrr": -500000 }
  ```
* **Security Barrier**: Financial bounds requirement `incoming().mrr >= 0`.

### Payload 12: Anonymous User Harvesting Waitlist
* **Target Path**: `waitlist/some_waitlist` (Listing records anonymously)
* **Vulnerability Target**: Scraping early access lists to spam potential leads.
* **Malicious Payload**: Attempting a query without `where` restriction or authentication.
* **Security Barrier**: Mandatory security assertion to enforce `resource.data.email == request.auth.token.email` or Admin validation.

---

## 3. Test Invariants

All twelve malicious payloads must result in `PERMISSION_DENIED` during physical simulation of firestore rules.
