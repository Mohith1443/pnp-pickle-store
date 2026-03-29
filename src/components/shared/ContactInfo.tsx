import { Mail, Phone, MapPin } from 'lucide-react';
import { businessConfig } from '../../config/business';

export default function ContactInfo() {
  return (
    <div className="bg-[#FFF8E1] p-5 md:p-6 rounded-2xl border border-[#FFE082] shadow-sm">
      <h3 className="font-black text-[#3E2723] text-lg mb-4">Contact Information</h3>
      <div className="space-y-4 text-[#5D4037] text-sm font-medium">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#F57C00] shadow-sm shrink-0">
            <Mail size={14}/>
          </div>
          <span>{businessConfig.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#F57C00] shadow-sm shrink-0">
            <Phone size={14}/>
          </div>
          <span>{businessConfig.phone}</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#F57C00] shadow-sm shrink-0 mt-0.5">
            <MapPin size={14}/>
          </div>
          <span className="leading-relaxed">{businessConfig.address}</span>
        </div>
      </div>
    </div>
  );
}