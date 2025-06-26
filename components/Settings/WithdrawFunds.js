import { useState } from "react";
import { DollarSign, CreditCard, Banknote, Send, Clock } from "lucide-react";
import Button from "@/components/ui/Button";

const WithdrawFunds = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully requested $${amount} withdrawal to your ${method}`);
      setAmount("");
    }, 1500);
  };

  return (
    <div className="p-4 mb-18 sm:p-6 max-w-4xl mx-auto overflow-y-auto space-y-8">
      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
          >
            <option value="bank">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
        </div>

        <Button
          variant="primarySettings"
          size="lg"
          onClick={handleWithdraw}
          disabled={!amount || isProcessing}
          className="w-full flex justify-center items-center disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Clock className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Withdraw Now
            </>
          )}
        </Button>

        <div className="text-sm text-gray-500 bg-blue-50 rounded-md p-4">
          Withdrawals may take up to 3–5 business days depending on your method.
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;
