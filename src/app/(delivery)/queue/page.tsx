export default function DeliveryQueue() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Deliveries</h1>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600">Your assigned drop-offs will appear here.</p>
        </div>
      </div>
    </div>
  );
}