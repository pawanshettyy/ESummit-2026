# Assets Directory

This directory contains static assets for the E-Summit 2026 platform.

## Required Files

### 1. Logo (logo.png)

**Requirements**:
- Format: PNG with transparent background
- Recommended Size: 512x512px
- Purpose: Used in PDFs, emails, and official documents

**Current Status**: ⚠️ **PLEASE ADD YOUR LOGO FILE HERE**

**How to Add**:
1. Prepare your E-Summit 2026 logo in PNG format
2. Name it exactly: `logo.png`
3. Place it in this directory: `backend/assets/logo.png`
4. The PDF generation system will automatically use it

### Fallback Behavior

If logo.png is not found, the system will:
- Use text "E-SUMMIT 2026" as fallback
- Log a warning message
- Continue PDF generation without logo image

## Future Assets

- Watermark graphics
- Background patterns
- Sponsor logos
- Custom fonts
