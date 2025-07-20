"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";

interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  sortCode: string;
  isDefault: boolean;
}

interface PaymentHistory {
  id: string;
  amount: number;
  status: string;
  date: string;
  description: string;
}

export default function PaymentsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    sortCode: "",
    isDefault: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Load data when authenticated
  useEffect(() => {
    console.log("Payments page - Session status:", status);
    console.log("Payments page - User role:", session?.user?.role);
    
    if (status === "unauthenticated") {
      console.log("Payments page - Redirecting to signin");
      router.push("/auth/signin");
    } else if (status === "loading") {
      console.log("Payments page - Session loading");
      // Do nothing while loading
    } else {
      console.log("Payments page - Loading data");
      fetchBankAccounts();
      fetchPaymentHistory();
    }
  }, [session, status, router]);

  const fetchBankAccounts = async () => {
    console.log('Fetching bank accounts...');
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/bank-accounts');
      console.log('Bank accounts API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Bank accounts API error:', errorData);
        throw new Error(`Failed to fetch bank accounts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Bank accounts fetched successfully:', data.length, 'accounts');
      setBankAccounts(data);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setError('Failed to load bank accounts. This may be because the database schema needs to be updated. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    console.log('Fetching payment history...');
    try {
      const response = await fetch('/api/business/payment-history');
      console.log('Payment history API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Payment history API error:', errorData);
        throw new Error(`Failed to fetch payment history: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Payment history fetched successfully:', data.length, 'records');
      setPaymentHistory(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Don't set error here to avoid overriding bank account errors
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/business/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add bank account');
      }
      
      await fetchBankAccounts();
      setSuccess('Bank account added successfully!');
      setFormData({ 
        accountHolderName: "", 
        accountNumber: "", 
        sortCode: "", 
        isDefault: false 
      });
      setIsAddAccountModalOpen(false);
    } catch (error) {
      console.error('Error adding bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to add bank account');
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentAccount) return;
    
    try {
      const response = await fetch(`/api/business/bank-accounts/${currentAccount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bank account');
      }
      
      await fetchBankAccounts();
      setSuccess('Bank account updated successfully!');
      setIsEditAccountModalOpen(false);
    } catch (error) {
      console.error('Error updating bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to update bank account');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`/api/business/bank-accounts/${accountId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete bank account');
      }
      
      await fetchBankAccounts();
      setSuccess('Bank account deleted successfully!');
    } catch (error) {
      console.error('Error deleting bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete bank account');
    }
  };

  const openAddAccountModal = () => {
    setFormData({ 
      accountHolderName: "", 
      accountNumber: "", 
      sortCode: "", 
      isDefault: false 
    });
    setIsAddAccountModalOpen(true);
  };

  const openEditAccountModal = (account: BankAccount) => {
    setCurrentAccount(account);
    setFormData({
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      sortCode: account.sortCode,
      isDefault: account.isDefault,
    });
    setIsEditAccountModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Function to mask account number for display
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    const masked = '*'.repeat(accountNumber.length - 4);
    return masked + lastFour;
  };

  // Function to format sort code with dashes
  const formatSortCode = (sortCode: string) => {
    if (sortCode.length !== 6) return sortCode;
    return `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`;
  };

  if (status === "loading" || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN)) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <Navigation />
      <div className="pt-24 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Payments Management</h1>
            <p className="mt-1 text-sm text-blue-200">Manage your payment methods and view payment history</p>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-900/30 border border-red-500/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-900/30 border border-green-500/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Bank Accounts Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Bank Accounts</h2>
              <button
                onClick={openAddAccountModal}
                className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Bank Account
              </button>
            </div>
            
            {bankAccounts.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {bankAccounts.map((account) => (
                    <li key={account.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{account.accountHolderName}</p>
                          <div className="mt-1 flex items-center">
                            <p className="text-sm text-gray-500 mr-4">Account: {maskAccountNumber(account.accountNumber)}</p>
                            <p className="text-sm text-gray-500">Sort Code: {formatSortCode(account.sortCode)}</p>
                          </div>
                          {account.isDefault && (
                            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditAccountModal(account)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p className="text-gray-500">No bank accounts found. Add your first bank account to receive payments.</p>
              </div>
            )}
          </div>
          
          {/* Payment History Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
            
            {paymentHistory.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{payment.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <p className="text-gray-500">No payment history found.</p>
              </div>
            )}
          </div>
          
          {/* Add Bank Account Modal */}
          {isAddAccountModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddAccountModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Add Bank Account</h3>
                        <div className="mt-2">
                          <form onSubmit={handleAddAccount}>
                            <div className="mb-4">
                              <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                              <input
                                type="text"
                                name="accountHolderName"
                                id="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                              <input
                                type="text"
                                name="accountNumber"
                                id="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{8}"
                                title="Account number must be 8 digits"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <p className="mt-1 text-xs text-gray-500">8 digit number</p>
                            </div>
                            <div className="mb-4">
                              <label htmlFor="sortCode" className="block text-sm font-medium text-gray-700">Sort Code</label>
                              <input
                                type="text"
                                name="sortCode"
                                id="sortCode"
                                value={formData.sortCode}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{6}"
                                title="Sort code must be 6 digits"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <p className="mt-1 text-xs text-gray-500">6 digit number (no dashes)</p>
                            </div>
                            <div className="mb-4 flex items-center">
                              <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">Set as default payment method</label>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Add Account
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAddAccountModalOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit Bank Account Modal */}
          {isEditAccountModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditAccountModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Bank Account</h3>
                        <div className="mt-2">
                          <form onSubmit={handleEditAccount}>
                            <div className="mb-4">
                              <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                              <input
                                type="text"
                                name="accountHolderName"
                                id="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                              <input
                                type="text"
                                name="accountNumber"
                                id="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{8}"
                                title="Account number must be 8 digits"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <p className="mt-1 text-xs text-gray-500">8 digit number</p>
                            </div>
                            <div className="mb-4">
                              <label htmlFor="sortCode" className="block text-sm font-medium text-gray-700">Sort Code</label>
                              <input
                                type="text"
                                name="sortCode"
                                id="sortCode"
                                value={formData.sortCode}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{6}"
                                title="Sort code must be 6 digits"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <p className="mt-1 text-xs text-gray-500">6 digit number (no dashes)</p>
                            </div>
                            <div className="mb-4 flex items-center">
                              <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">Set as default payment method</label>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Update Account
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditAccountModalOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
