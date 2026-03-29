import PolicyContent from '../../../components/shared/PolicyContent';
import { businessConfig } from '../../../config/business';

export default function ReturnsPage() {
  return (
    <main className="min-h-[70vh] bg-[#FAFAF7] py-12 md:py-16 px-4 flex justify-center">
      <div className="w-full max-w-5xl">
        <PolicyContent policy={businessConfig.policies.shippingPolicy} />
      </div>
    </main>
  );
}