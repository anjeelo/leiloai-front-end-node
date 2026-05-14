// leiloai-frontend/src/pages/CreateAuction.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CreateAuction.css';

export default function CreateAuction() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const price = parseFloat(initialPrice);
    if (isNaN(price) || price <= 0) {
      setError('Preço inicial inválido');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Data de término deve ser posterior à data de início');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auctions', {
        title,
        description,
        initialPrice: price,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      navigate(`/auctions/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar leilão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="create-auction-card">
        <h2>Criar Novo Leilão</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Carro Antigo 1970"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Descreva o item do leilão..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="initialPrice">Preço Inicial (R$)</label>
            <input
              type="number"
              id="initialPrice"
              step="0.01"
              min="0.01"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              required
              placeholder="Ex: 1000.00"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Data de Início</label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Data de Término</label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Leilão'}
          </button>
        </form>
      </div>
    </div>
  );
}