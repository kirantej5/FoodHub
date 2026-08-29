import { Check, Clock, ChefHat, Bike, Package } from 'lucide-react';

export default function OrderStatusStepper({ status }) {
  const steps = [
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'confirmed', label: 'Confirmed', icon: Check },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { id: 'delivered', label: 'Delivered', icon: Package },
  ];

  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center font-medium">
        This order has been cancelled
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.id === status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="relative flex justify-between">
      {/* Background Line */}
      <div className="absolute top-5 left-8 right-8 h-1 bg-zinc-800 -z-10 rounded-full" />
      
      {/* Active Line */}
      <div 
        className="absolute top-5 left-8 h-1 bg-orange-500 -z-10 rounded-full transition-all duration-1000 ease-in-out" 
        style={{ width: `calc(${activeIdx * 25}% - ${activeIdx === 4 ? 32 : 16}px)` }} 
      />

      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx <= activeIdx;
        const isCurrent = idx === activeIdx;

        return (
          <div key={step.id} className="flex flex-col items-center gap-2 w-20">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isActive 
                  ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500'
              } ${isCurrent ? 'scale-110' : ''}`}
            >
              <Icon size={18} />
            </div>
            <span className={`text-xs font-medium text-center ${isActive ? 'text-white' : 'text-zinc-500'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
