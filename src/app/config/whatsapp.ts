// WhatsApp Configuration
// Replace this number with your actual company WhatsApp number
// Format: country code + number (without + or spaces)
// Example: For +1 234-567-8900, use "12345678900"

export const COMPANY_WHATSAPP = "917025752005";

// Helper function to create WhatsApp URL
export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// Helper function to open WhatsApp chat
export function openWhatsAppChat(message: string): void {
  const url = createWhatsAppUrl(message);
  window.open(url, '_blank');
}
