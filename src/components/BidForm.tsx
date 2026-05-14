// leiloai-frontend/src/components/BidForm.tsx
import { useState, FormEvent } from 'react';
import api from '../api/axios';
import './BidForm.css';

interface BidFormProps {
  auctionId: string;
  onBidPlaced: () => void;
}

export default function BidForm({ auctionId, onBidPlaced }: BidFormProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setError('Digite um valor válido');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auctions/${auctionId}/bids`, { amount: bidAmount });
      setSuccess('Lance registrado com sucesso!');
      setAmount('');
      onBidPlaced();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar lance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bid-form">
      <h3>Dar Lance</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Valor do Lance (R$)</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Ex: 1500.00"
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Enviando...' : 'Dar Lance'}
        </button>
      </form>
    </div>
  );
}