import PolicyContent from '../../../components/shared/PolicyContent';
import { businessConfig } from '../../../config/business';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <PolicyContent policy={businessConfig.policies.returnPolicy} />
      </div>
    </main>
  );
}