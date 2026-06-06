# WhatsApp Integration Setup Guide

This travel landing page includes WhatsApp integration for instant booking inquiries. When users click any "Book" button, their booking details are automatically sent to your company's WhatsApp number.

## 📱 How to Configure Your WhatsApp Number

### Step 1: Update the WhatsApp Number

Open the file `/src/app/config/whatsapp.ts` and replace the placeholder number with your actual company WhatsApp number.

```typescript
// Replace "1234567890" with your actual number
export const COMPANY_WHATSAPP = "1234567890";
```

### Step 2: Format Your Number Correctly

**Important:** The number must be in international format WITHOUT the "+" symbol or any spaces/dashes.

#### Examples:
- ✅ **Correct:** `"919876543210"` (India: +91 9876543210)
- ✅ **Correct:** `"12125551234"` (USA: +1 212-555-1234)
- ✅ **Correct:** `"447911123456"` (UK: +44 7911 123456)
- ❌ **Wrong:** `"+919876543210"` (has + symbol)
- ❌ **Wrong:** `"91 9876543210"` (has space)
- ❌ **Wrong:** `"91-9876-543210"` (has dashes)

### Step 3: Country Code Reference

| Country | Code | Example Number | Formatted |
|---------|------|---------------|-----------|
| USA | +1 | +1 234-567-8900 | `12345678900` |
| UK | +44 | +44 7911 123456 | `447911123456` |
| India | +91 | +91 98765 43210 | `919876543210` |
| UAE | +971 | +971 50 123 4567 | `971501234567` |
| Singapore | +65 | +65 9123 4567 | `6591234567` |
| Australia | +61 | +61 4 1234 5678 | `61412345678` |

## 🎯 What Happens When Users Book?

### Tour Package Bookings
When users click "Book" on a tour package, WhatsApp opens with a pre-filled message containing:
- Tour package name
- Location
- Duration
- Group size
- Price
- Rating

### Taxi Bookings
When users click "Book Now" in the taxi section, WhatsApp opens with:
- Pickup location
- Drop-off location
- Date and time
- Vehicle type selected

### General Bookings
When users click "Book Now" in the header, a general inquiry message is sent.

## 🔧 Testing

After updating your WhatsApp number:

1. Click any "Book" button on the website
2. A new tab/window should open with WhatsApp Web or the WhatsApp app
3. The message should be pre-filled with booking details
4. Verify the message is being sent to your correct WhatsApp number

## 📝 Customizing Messages

To customize the messages sent to WhatsApp, edit these files:

- **Header "Book Now":** `/src/app/components/Header.tsx`
- **Tour Packages:** `/src/app/components/TourPackages.tsx`
- **Taxi Service:** `/src/app/components/TaxiService.tsx`

Look for the `handleBook...` functions and modify the message template as needed.

## 🌐 WhatsApp Business Recommended

For a professional experience, we recommend using **WhatsApp Business** instead of regular WhatsApp:

Benefits:
- ✅ Professional business profile
- ✅ Quick replies and automated messages
- ✅ Labels to organize conversations
- ✅ Business statistics
- ✅ Catalog feature for tour packages

Download WhatsApp Business: https://www.whatsapp.com/business

## ❓ Troubleshooting

**Issue:** WhatsApp doesn't open
- Make sure WhatsApp is installed on your device or use WhatsApp Web
- Check that the number format is correct (no +, spaces, or dashes)

**Issue:** Wrong number receives the message
- Verify the COMPANY_WHATSAPP value in `/src/app/config/whatsapp.ts`
- Make sure you included the country code

**Issue:** Message doesn't include booking details
- Check that form fields are being filled by users
- The taxi booking form uses controlled inputs, so ensure users enter data

## 📞 Support

For any issues or questions about the WhatsApp integration, please refer to the WhatsApp Business API documentation or contact your developer.
