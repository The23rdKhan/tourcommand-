import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancialCardProps {
  title: string;
  amount: number;
  type: 'revenue' | 'expense' | 'profit' | 'neutral';
  subtitle?: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ title, amount, type, subtitle }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  let colorClass = 'text-slate-100';
  let Icon = DollarSign;

  if (type === 'revenue') {
    colorClass = 'text-emerald-400';
    Icon = TrendingUp;
  } else if (type === 'expense') {
    colorClass = 'text-rose-400';
    Icon = TrendingDown;
  } else if (type === 'profit') {
    colorClass = amount >= 0 ? 'text-emerald-400' : 'text-rose-400';
    Icon = amount >= 0 ? TrendingUp : TrendingDown;
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className={`p-2 rounded-full bg-slate-700/50 ${colorClass}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {formatCurrency(amount)}
      </div>
      {subtitle && (
        <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default FinancialCard;
