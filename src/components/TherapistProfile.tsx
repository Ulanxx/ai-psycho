import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/theme';
import { Star, MapPin, Phone, Mail, Clock, X, CreditCard } from 'lucide-react';

interface TherapistProfileProps {
  therapist: any;
  onClose: () => void;
}

export function TherapistProfile({ therapist, onClose }: TherapistProfileProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [showPayment, setShowPayment] = useState(false);

  const clinic = {
    name: "Mindful Health Center",
    address: "789 Healing Street, Suite 301",
    city: "San Francisco, CA 94105",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    phone: "+1 (415) 555-0123",
    email: "contact@mindfulhealth.com"
  };

  const handleContactClick = () => {
    setShowPayment(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      
    </div>
  );
}