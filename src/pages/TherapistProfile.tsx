import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/theme';
import { Star, MapPin, Video, Shield, ArrowLeft, Calendar, Award, MessageCircle, CheckCircle } from 'lucide-react';

// 从TherapistList中导入数据和类型
import { therapists } from '../components/TherapistList';
import type { Therapist } from '../components/TherapistCard';
import { PaymentModal } from '../components/PaymentModal';

export function TherapistProfilePage() {
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    const currentTherapist = therapists.find(t => t.id === id);
    setTherapist(currentTherapist || null);
  }, [id]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setShowPayment(false);
    // 可以添加一个成功提示
    setTimeout(() => {
      navigate(-1); // 或者导航到预约成功页面
    }, 2000);
  };

  if (!therapist) return null;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航 */}
      <div className={`sticky top-0 z-10 ${isDark ? 'bg-dark-800' : 'bg-white'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium">{therapist.name}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 基本信息 */}
        <div className="flex gap-4">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="w-24 h-24 rounded-xl object-cover"
          />
          <div>
            <h2 className="text-xl font-medium">{therapist.name}</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{therapist.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{therapist.rating}</span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ({therapist.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* 视频问诊和保险信息 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-500" />
            <span>Video Visit Available · External</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span>In-network with {therapist.insurance.join(', ')}</span>
          </div>
        </div>

        {/* 预约时间 */}
        <div>
          <h3 className="text-lg font-medium mb-3">Available Appointments</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(therapist.availability).map(([day, slots]) => (
              <div
                key={day}
                className={`p-3 rounded-xl text-center ${slots > 0
                  ? 'bg-yellow-100 text-gray-900'
                  : isDark ? 'bg-dark-700' : 'bg-gray-100'
                  }`}
              >
                <div className="capitalize font-medium">{day}</div>
                <div>{slots > 0 ? `${slots} slots` : 'No slots'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 预约按钮 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment · $99
            </button>
          </div>
        </div>

        {/* 支付弹窗 */}
        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
            price={99}
            therapist={{
              name: therapist.name,
              title: therapist.title,
              image: therapist.image,
            }}
          />
        )}

        {/* 支付成功提示 */}
        {paymentStatus === 'success' && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Payment successful! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
}