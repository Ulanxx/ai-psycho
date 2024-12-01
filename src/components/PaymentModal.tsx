import React from 'react';
import { X } from 'lucide-react';

interface PaymentModalProps {
    onClose: () => void;
    onSuccess: () => void;
    price: number;
    therapist: {
        name: string;
        title: string;
        image: string;
    };
}

export function PaymentModal({ onClose, onSuccess, price, therapist }: PaymentModalProps) {
    const handlePayment = () => {
        // 模拟支付过程
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-2xl w-full max-w-md overflow-hidden">
                {/* 顶部关闭按钮 */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-lg font-medium text-white">Confirm Payment</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/10 text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 医生信息 */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img
                            src={therapist.image}
                            alt={therapist.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h4 className="font-medium text-white">{therapist.name}</h4>
                            <p className="text-sm text-gray-400">{therapist.title}</p>
                        </div>
                    </div>
                </div>

                {/* 支付详情 */}
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Consultation Fee</span>
                        <span className="text-white font-medium">${price}</span>
                    </div>

                    {/* PayPal 按钮 */}
                    <button
                        onClick={handlePayment}
                        className="w-full py-3 px-4 bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        Pay with PayPal
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        By clicking "Pay with PayPal", you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
} 