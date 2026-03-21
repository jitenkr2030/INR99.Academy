# Custom Domain Setup Guide for Schools

## Overview

INR99 Academy provides white-label learning platform access to schools with 1000+ students. Schools get their own branded domain (e.g., `yourschool.com`) instead of a subdomain, giving parents and students a fully branded experience.

---

## Prerequisites

Before starting, ensure you have:

- Registered domain name (e.g., `yourschool.com`)
- Access to your domain's DNS settings (your domain registrar)
- Admin access to INR99 Academy dashboard
- Minimum 1000 enrolled students

---

## Step-by-Step Setup Process

### Step 1: Register Your Institution

1. Visit [INR99 Academy Registration](https://inr99.academy/institution/signup)
2. Fill in your institution details:
   - Institution Name
   - Institution Type (School, College, Coaching Institute, etc.)
   - Number of Students (must be 1000+ for free white-label access)
   - Admin Email and Phone Number

3. In the Custom Domain step, enter your domain name:
   - Example: `yourschool.com`
   - Do NOT include `www.` or `https://`
   - Use lowercase letters only

4. Complete admin account creation
5. Wait for confirmation email after registration

### Step 2: Configure DNS Settings

After registration, you need to add a CNAME record to your domain's DNS settings.

#### How to Access DNS Settings

The process varies by domain registrar. Common registrars include:

- **GoDaddy**: Domain Settings → DNS Management
- **Namecheap**: Domain List → Advanced DNS
- **BigRock**: Login → My Products → DNS Management
- **Cloudflare**: Dashboard → Overview → DNS Records
- **Domain.com**: My Domains → DNS Records

#### Adding the CNAME Record

| Setting | Value |
|---------|-------|
| **Type** | CNAME |
| **Name/Host** | @ (or leave blank) |
| **Value/Points to** | `cname.inr99.academy` |
| **TTL** | 3600 (1 hour) |

#### Alternative: Using www Subdomain

If you prefer to use `www.yourschool.com` instead of `yourschool.com`:

| Setting | Value |
|---------|-------|
| **Type** | CNAME |
| **Name/Host** | www |
| **Value/Points to** | `cname.inr99.academy` |
| **TTL** | 3600 (1 hour) |

### Step 3: Verify Domain Connection

After adding DNS records:

1. Wait 15 minutes to 48 hours for DNS propagation (usually takes 1-4 hours)
2. Visit your domain in a browser
3. You should see the INR99 Academy login page with your school's branding

---

## DNS Configuration Examples by Registrar

### GoDaddy

1. Log in to GoDaddy
2. Go to **My Products**
3. Find your domain and click **DNS**
4. Click **Add** → **CNAME**
5. Fill in:
   - **Name**: `@` (or `www`)
   - **Value**: `cname.inr99.academy`
   - **TTL**: `1 Hour`

### Namecheap

1. Log in to Namecheap
2. Go to **Dashboard** → **Domain List**
3. Click **Manage** → **Advanced DNS**
4. Click **Add New Record** → **CNAME Record**
5. Fill in:
   - **Host**: `@` (or `www`)
   - **Value**: `cname.inr99.academy`
   - **TTL**: `Automatic`

### Cloudflare

1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Select **CNAME** as type
6. Fill in:
   - **Name**: `@` (or `www`)
   - **Target**: `cname.inr99.academy`
   - **Proxy status**: DNS only (grey cloud)
   - **TTL**: `Auto`

### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Click **Configure DNS**
4. Scroll to **Synthetic records** or **Custom resource records**
5. Add CNAME:
   - **Subdomain**: `@` (or `www`)
   - **Canonical name**: `cname.inr99.academy`

---

## Domain Verification Process

### Automatic Verification

INR99 Academy automatically verifies your domain within 1-4 hours after DNS configuration by:

1. Checking if the CNAME record points to `cname.inr99.academy`
2. Issuing SSL certificate for your domain
3. Activating your white-label platform

### Manual Verification

If automatic verification fails:

1. Log in to your INR99 Academy dashboard
2. Go to **Settings** → **Domain Settings**
3. Click **Verify Domain**
4. System will check DNS configuration
5. If verified, your domain will be activated

---

## Troubleshooting

### Domain Not Loading

**Problem**: Your domain shows "Site not found" or error page

**Solutions**:
1. Wait longer for DNS propagation (up to 48 hours)
2. Clear browser cache
3. Try in incognito/private window
4. Check CNAME record is correctly configured
5. Verify no conflicting DNS records (A records, other CNAMEs)

### SSL Certificate Issues

**Problem**: Browser shows "Not Secure" or certificate error

**Solutions**:
1. Wait 24-48 hours for SSL provisioning
2. Clear browser cache and cookies
3. Try different browser
4. Contact INR99 Academy support if issue persists

### DNS Record Not Propagating

**Problem**: Changes not taking effect

**Solutions**:
1. Use [dnschecker.org](https://dnschecker.org) to check global propagation
2. Wait for full propagation (up to 48 hours)
3. Reduce TTL before making changes (change 3600 to 300)
4. Flush local DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`

### CNAME Record Conflicts

**Problem**: Error says "Conflicting CNAME record"

**Solutions**:
1. Remove any existing CNAME records for `@` or `www`
2. Delete any A records that might conflict
3. Wait 10 minutes and try again

---

## Domain Status Definitions

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| **Pending** | DNS records detected, verification in progress | Wait 1-4 hours |
| **Active** | Domain verified and working | None |
| **Failed** | DNS verification failed | Check CNAME configuration |
| **Expired** | Domain verification expired | Re-verify domain |

---

## Multiple Domain Configuration

### Adding Additional Domains

If you want to use multiple domains (e.g., `.in` and `.com`):

1. Log in to dashboard
2. Go to **Settings** → **Domain Settings**
3. Click **Add Additional Domain**
4. Add CNAME record for the new domain
5. Both domains will point to the same platform

### Redirecting Domains

To redirect one domain to another:

1. Configure CNAME for primary domain
2. Use domain registrar's redirect/forwarding feature for secondary domain
3. Set permanent redirect (301) to primary domain

---

## Technical Support

### Contact INR99 Academy Support

If you need assistance:

- **Email**: support@inr99.academy
- **Phone**: Available in dashboard
- **Hours**: Monday-Saturday, 9 AM - 6 PM IST

### Required Information for Support

When contacting support, include:

1. Domain name
2. Screenshot of DNS configuration
3. Current domain status in dashboard
4. Registration confirmation email

---

## Security Considerations

### SSL Certificates

- INR99 Academy provides free SSL certificates for all custom domains
- Certificates are automatically provisioned and renewed
- No manual certificate management required

### Domain Ownership

- Ensure domain registration is in school's name
- Keep domain registrar login credentials secure
- Enable two-factor authentication on registrar account

### DNS Security

- Restrict DNS management access to authorized personnel
- Monitor for unauthorized DNS changes
- Keep registrar account secure

---

## Best Practices

1. **Plan Ahead**: Domain setup can take 24-48 hours for full propagation
2. **Communicate**: Inform parents and students about the new domain
3. **Test Thoroughly**: Verify all features work on the new domain
4. **Update Links**: Update any bookmarks or saved links
5. **Monitor**: Check domain status regularly in dashboard

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│           CUSTOM DOMAIN SETUP QUICK REFERENCE           │
├─────────────────────────────────────────────────────────┤
│  1. Register at inr99.academy/institution/signup      │
│  2. Enter your domain (e.g., yourschool.com)           │
│  3. Add CNAME record:                                 │
│     • Type: CNAME                                      │
│     • Name: @ (or www)                                │
│     • Value: cname.inr99.academy                      │
│     • TTL: 3600                                       │
│  4. Wait 1-48 hours for propagation                    │
│  5. Test your domain                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Frequently Asked Questions

**Q: Can I use a subdomain instead of root domain?**
A: Yes, you can use `www.yourschool.com` or `learn.yourschool.com`

**Q: What happens if I don't have 1000+ students?**
A: Schools with fewer students can still use the platform with limited features

**Q: Can I change my domain after registration?**
A: Yes, contact support to update your domain

**Q: Is there a cost for custom domain?**
A: No, custom domain is free for eligible institutions (1000+ students)

**Q: How long does setup take?**
A: Registration is instant, DNS propagation takes 1-48 hours

---

*Document Version: 1.0*
*Last Updated: March 2026*
*INR99 Academy - India's Learning Infrastructure*
