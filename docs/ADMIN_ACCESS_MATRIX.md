# Admin Panel Access Matrix

## Role-Based Feature Access

### Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    E-Summit 2025 Admin Panel                     │
│                     Feature Access Matrix                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────┬──────────┬──────────┐
│    Feature       │   Core   │    JC    │    OC    │
├──────────────────┼──────────┼──────────┼──────────┤
│ Participants Tab │    ✅    │    ✅    │    ✅    │
│ QR Scanner Tab   │    ✅    │    ✅    │    ✅    │
│ Analytics Tab    │    ✅    │    ✅    │    ❌    │
│ Event IDs Tab    │    ✅    │    ❌    │    ❌    │
│ Export CSV       │    ✅    │    ✅    │    ❌    │
│ Edit Permissions │    ✅    │    ❌    │    ❌    │
└──────────────────┴──────────┴──────────┴──────────┘
```

---

## Detailed Feature Breakdown

### 1. Participants Tab
**Available to**: Core, JC, OC (All Roles)

**Features**:
- View all registered participants
- Search by name, email, or pass ID
- Filter by pass type
- View participant details
- Check check-in status

**Additional Capabilities by Role**:
- **Core**: Can export CSV, full edit access
- **JC**: Can export CSV
- **OC**: View only, no export

---

### 2. QR Scanner Tab
**Available to**: Core, JC, OC (All Roles)

**Features**:
- Scan QR codes for check-in
- Manual pass ID entry
- View check-in history
- Real-time check-in updates

**Permissions**:
- All roles can perform check-ins
- All check-ins are logged with admin Clerk user ID
- Audit trail maintained for all scans

---

### 3. Analytics Tab
**Available to**: Core, JC

**Features**:
- Pass type distribution charts
- Registration statistics
- College-wise breakdown
- Check-in analytics
- Revenue reports

**Export Options**:
- **Core**: Full data export
- **JC**: Full data export
- **OC**: No access to this tab

---

### 4. Event IDs Tab
**Available to**: Core (Only)

**Features**:
- Generate unique event IDs
- Create event identifiers
- Manage event code system
- Event tracking setup

**Restrictions**:
- Exclusive to Core team
- Not visible to JC or OC

---

## UI Changes by Role

### Core Team View

```
┌────────────────────────────────────────────────────────┐
│  Admin Dashboard                           [Core] 🛡️  │
│  E-Summit 2026 Management Panel                        │
├────────────────────────────────────────────────────────┤
│  📊 Stats: 1,234 Registrations | 987 Active | 456 Today│
├────────────────────────────────────────────────────────┤
│  Tabs: [Participants] [QR Scanner] [Analytics] [Event IDs] │
│                                                         │
│  ✅ All features visible                                │
│  ✅ Export CSV button shown                             │
│  ✅ All 4 tabs accessible                               │
└────────────────────────────────────────────────────────┘
```

### JC View

```
┌────────────────────────────────────────────────────────┐
│  Admin Dashboard                            [JC] 🛡️   │
│  E-Summit 2026 Management Panel                        │
├────────────────────────────────────────────────────────┤
│  📊 Stats: 1,234 Registrations | 987 Active | 456 Today│
├────────────────────────────────────────────────────────┤
│  Tabs: [Participants] [QR Scanner] [Analytics]         │
│                                                         │
│  ✅ 3 tabs visible                                      │
│  ✅ Export CSV button shown                             │
│  ❌ Event IDs tab hidden                                │
└────────────────────────────────────────────────────────┘

⚠️  Info Alert:
"Your Access Level: You have access to Participants, 
QR Scanner, and Analytics."
```

### OC View

```
┌────────────────────────────────────────────────────────┐
│  Admin Dashboard                            [OC] 🛡️   │
│  E-Summit 2026 Management Panel                        │
├────────────────────────────────────────────────────────┤
│  📊 Stats: 1,234 Registrations | 987 Active | 456 Today│
├────────────────────────────────────────────────────────┤
│  Tabs: [Participants] [QR Scanner]                     │
│                                                         │
│  ✅ 2 tabs visible only                                 │
│  ❌ Export CSV button hidden                            │
│  ❌ Analytics tab hidden                                │
│  ❌ Event IDs tab hidden                                │
└────────────────────────────────────────────────────────┘

⚠️  Info Alert:
"Your Access Level: You have access to Participants 
and QR Scanner only."
```

---

## Role Assignment Examples

### Setting Roles in Clerk Dashboard

**Core Team Member**:
```json
{
  "role": "Core"
}
```
→ Gets all 4 tabs + export + edit permissions

**JC Member**:
```json
{
  "role": "JC"
}
```
→ Gets 3 tabs (Participants, Scanner, Analytics) + export

**OC Member**:
```json
{
  "role": "OC"
}
```
→ Gets 2 tabs (Participants, Scanner) only

---

## Common Use Cases

### Scenario 1: Event Day Check-ins
**Who**: All roles (Core, JC, OC)
**Access**: QR Scanner tab
**Action**: Scan participant QR codes at venue entrance
**Result**: Check-in recorded with admin's Clerk user ID

### Scenario 2: Participant Data Review
**Who**: All roles (Core, JC, OC)
**Access**: Participants tab
**Action**: Search and view participant information
**Limitation**: OC cannot export, Core/JC can export

### Scenario 3: Post-Event Analytics
**Who**: Core, JC only
**Access**: Analytics tab
**Action**: View registration trends, pass distribution, college-wise stats
**Export**: Both can export analytics data

### Scenario 4: Event ID Generation
**Who**: Core only
**Access**: Event IDs tab
**Action**: Generate unique identifiers for events
**Restriction**: Exclusive Core team feature

---

## Security Features

### Access Control
- ✅ Role checked on every admin panel load
- ✅ Tabs conditionally rendered based on role
- ✅ Export button hidden for OC
- ✅ Backend API validates role before processing
- ✅ Unauthorized access redirects to home

### Audit Trail
- ✅ All admin actions logged
- ✅ Role included in audit logs
- ✅ Check-ins tagged with admin Clerk user ID
- ✅ Export actions tracked
- ✅ Event ID generation logged

### Session Management
- ✅ Clerk handles session security
- ✅ Role verified on each API call
- ✅ Automatic session refresh
- ✅ Logout clears all permissions

---

## Testing Checklist

### Core Role Testing
- [ ] Login as Core user
- [ ] Verify all 4 tabs visible
- [ ] Test Participants tab access
- [ ] Test QR Scanner functionality
- [ ] Test Analytics tab data
- [ ] Test Event IDs tab access
- [ ] Verify Export CSV button exists
- [ ] Export CSV and verify download
- [ ] Check no access alert shown

### JC Role Testing
- [ ] Login as JC user
- [ ] Verify only 3 tabs visible (no Event IDs)
- [ ] Test Participants tab access
- [ ] Test QR Scanner functionality
- [ ] Test Analytics tab data
- [ ] Verify Event IDs tab hidden
- [ ] Verify Export CSV button exists
- [ ] Export CSV and verify download
- [ ] Check access alert shows JC permissions

### OC Role Testing
- [ ] Login as OC user
- [ ] Verify only 2 tabs visible
- [ ] Test Participants tab access (view only)
- [ ] Test QR Scanner functionality
- [ ] Verify Analytics tab hidden
- [ ] Verify Event IDs tab hidden
- [ ] Verify Export CSV button hidden
- [ ] Check access alert shows OC permissions
- [ ] Try to access hidden tabs (should fail)

---

## Quick Reference Commands

### Assign Core Role
```bash
# Via Clerk Dashboard
Users → Select User → Public Metadata → Add:
{ "role": "Core" }
```

### Assign JC Role
```bash
# Via Clerk Dashboard
Users → Select User → Public Metadata → Add:
{ "role": "JC" }
```

### Assign OC Role
```bash
# Via Clerk Dashboard
Users → Select User → Public Metadata → Add:
{ "role": "OC" }
```

### Remove Admin Access
```bash
# Via Clerk Dashboard
Users → Select User → Public Metadata → Remove role field
```

---

## Support & Troubleshooting

### User Can't See Admin Panel
**Check**: Is `role` set in publicMetadata?
**Fix**: Add role in Clerk Dashboard

### User Sees Wrong Tabs
**Check**: Is correct role assigned?
**Fix**: Update role in Clerk Dashboard

### Export Button Not Showing for JC
**Check**: Frontend code has `permissions.export` check
**Fix**: Verify ROLE_PERMISSIONS object has export: true for JC

### Event IDs Tab Showing for JC
**Check**: Tab visibility logic
**Fix**: Should check `permissions.eventIds` not role directly

---

**Created**: January 2026  
**Last Updated**: January 2026  
**Version**: 1.0
