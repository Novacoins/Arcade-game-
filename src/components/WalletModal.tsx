/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, ShieldCheck, Award, Clock, DollarSign } from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';

interface WalletModalProps {
  profile: UserProfile;
  transactions: WalletTransaction[];
  onClose: () => void;
  onUpdateWallet: (amount: number, currency: 'coins' | 'diamonds', type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward', title?: string) => void;
}

export default function WalletModal({ profile, transactions, onClose, onUpdateWallet }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transactions'>('deposit');
  const [amount, setAmount] = useState<string>('5000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('5000');
  const [currency, setCurrency] = useState<'coins' | 'diamonds'>('coins');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('demo_wallet_address_0x...');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    onUpdateWallet(val, currency, 'deposit', 'Demo Credit Deposit');
    setSuccessMsg(`Simulated Deposit of ${val.toLocaleString()} ${currency === 'coins' ? 'Coins' : 'Diamonds'} successful!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) return;

    const maxVal = currency === 'coins' ? profile.coins : profile.diamonds;
    if (val > maxVal) {
      alert(`Insufficient balance! Max available: ${maxVal}`);
      return;
    }

    onUpdateWallet(-val, currency, 'withdraw', 'Demo Debit Withdrawal');
    setSuccessMsg(`Simulated Withdrawal of ${val.toLocaleString()} ${currency === 'coins' ? 'Coins' : 'Diamonds'} initiated to address!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleClaimFreeFaucet = () => {
    onUpdateWallet(2500, 'coins', 'reward', 'Free Daily Faucet');
    onUpdateWallet(25, 'diamonds', 'reward', 'Free Daily Faucet');
    setSuccessMsg('Claimed free 2,500 Coins & 25 Diamonds!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="wallet_modal">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-modal text-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight uppercase">Virtual Cashier</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <div className="p-6">
          
          {/* Quick Balance Panel */}
          <div className="grid grid-cols-2 gap-4 bg-white/3 border border-white/5 p-4 rounded-2xl mb-6">
            <div className="text-center">
              <p className="text-[10px] font-black tracking-wider text-gray-500 uppercase">Total Coins Balance</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xl font-black text-amber-400">{profile.coins.toLocaleString()}</span>
                <span>🪙</span>
              </div>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[10px] font-black tracking-wider text-gray-500 uppercase">Total Diamonds Balance</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xl font-black text-purple-400">{profile.diamonds.toLocaleString()}</span>
                <span>💎</span>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-white/5 mb-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider text-center border-b-2 transition duration-200 ${
                activeTab === 'deposit' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider text-center border-b-2 transition duration-200 ${
                activeTab === 'withdraw' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider text-center border-b-2 transition duration-200 ${
                activeTab === 'transactions' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              Ledger
            </button>
          </div>

          {/* Alerts / Feedback Message */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-semibold mb-4 leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Deposit panel */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Select Asset</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrency('coins')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition ${
                      currency === 'coins' ? 'border-amber-400 bg-amber-400/5 text-amber-400' : 'border-white/5 text-gray-400'
                    }`}
                  >
                    <span>Coins</span>
                    <span>🪙</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('diamonds')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition ${
                      currency === 'diamonds' ? 'border-purple-400 bg-purple-400/5 text-purple-400' : 'border-white/5 text-gray-400'
                    }`}
                  >
                    <span>Diamonds</span>
                    <span>💎</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Deposit Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl glass-input py-2.5 pl-4 pr-12 text-sm text-white outline-none"
                    placeholder="Enter amount"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">
                    {currency.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['1000', '5000', '10000', '50000'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-1.5 rounded-lg border border-white/5 bg-white/3 text-xs font-bold hover:border-red-500/40 hover:bg-white/6 transition"
                  >
                    +{parseInt(val).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleClaimFreeFaucet}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-amber-500/30 hover:bg-amber-500/5 text-amber-400 font-extrabold text-xs uppercase"
                >
                  <Award className="h-4 w-4" />
                  Free Faucet
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs uppercase shadow-lg shadow-red-600/10"
                >
                  Confirm Deposit (Demo)
                </button>
              </div>
            </form>
          )}

          {/* Withdraw panel */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Withdraw Asset</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrency('coins')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition ${
                      currency === 'coins' ? 'border-amber-400 bg-amber-400/5 text-amber-400' : 'border-white/5 text-gray-400'
                    }`}
                  >
                    <span>Coins</span>
                    <span>🪙</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('diamonds')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition ${
                      currency === 'diamonds' ? 'border-purple-400 bg-purple-400/5 text-purple-400' : 'border-white/5 text-gray-400'
                    }`}
                  >
                    <span>Diamonds</span>
                    <span>💎</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Withdrawal Address / Method</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full rounded-xl glass-input py-2.5 px-4 text-sm text-white outline-none"
                  placeholder="Enter recipient address"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Withdraw Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full rounded-xl glass-input py-2.5 pl-4 pr-12 text-sm text-white outline-none"
                    placeholder="Enter withdrawal amount"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">
                    {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[10px] text-gray-500">Processing Time: Instant</span>
                  <button 
                    type="button"
                    onClick={() => setWithdrawAmount(currency === 'coins' ? profile.coins.toString() : profile.diamonds.toString())}
                    className="text-[10px] text-red-500 hover:underline font-bold"
                  >
                    Max Wallet
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs uppercase shadow-lg shadow-red-600/10"
              >
                Confirm Withdrawal (Demo)
              </button>
            </form>
          )}

          {/* Transactions Ledger Panel */}
          {activeTab === 'transactions' && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs font-medium">
                  No previous transaction logs recorded in this cache session.
                </div>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        t.type === 'deposit' || t.type === 'win' || t.type === 'reward' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {t.type === 'deposit' || t.type === 'win' || t.type === 'reward' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white capitalize">{t.type} - {t.gameTitle || 'Portal Cashier'}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {t.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right font-black text-xs ${
                      t.type === 'deposit' || t.type === 'win' || t.type === 'reward' 
                        ? 'text-emerald-400' 
                        : 'text-red-400'
                    }`}>
                      {t.type === 'deposit' || t.type === 'win' || t.type === 'reward' ? '+' : '-'}
                      {t.amount.toLocaleString()} {t.currency === 'coins' ? '🪙' : '💎'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer warning */}
        <div className="bg-red-600/5 border-t border-white/5 px-6 py-4 flex gap-2 items-start">
          <DollarSign className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            All cashier functions are for <strong className="text-white">simulated game demo purposes only</strong>. No real currencies or transfers are processed. Claim free faucet coins anytime.
          </p>
        </div>

      </div>
    </div>
  );
}
