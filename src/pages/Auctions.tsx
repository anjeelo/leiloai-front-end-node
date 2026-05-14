// leiloai-frontend/src/pages/Auctions.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Auctions.css';

interface Auction {
  id: string;
  title: string;
  description: string;
  initialPrice: number;
  currentPrice: number;
  startDate: string;
  endDate: string;
  status: string;
  sellerName: string;
  imageFilename: string | null;
}

export default function Auctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('OPEN');

  useEffect(() => {
    loadAuctions();
  }, [statusFilter]);

  const loadAuctions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/auctions?status=${statusFilter}`);
      setAuctions(response.data);
    } catch (err: any) {
      setError('Erro ao carregar leilões');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      OPEN: '🟢 Aberto',
      CLOSED: '🔴 Fechado',
      CANCELLED: '⚫ Cancelado',
    };
    return badges[status] || status;
  };

  if (loading) return <div className="container">Carregando leilões...</div>;

  return (
    <div className="container">
      <div className="auctions-header">
        <h1>Leilões</h1>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="OPEN">Abertos</option>
            <option value="CLOSED">Fechados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {auctions.length === 0 ? (
        <p className="no-auctions">Nenhum leilão encontrado.</p>
      ) : (
        <div className="auctions-grid">
          {auctions.map((auction) => (
            <Link to={`/auctions/${auction.id}`} key={auction.id} className="auction-card-link">
              <div className="card auction-card">
                {auction.imageFilename && (
                  <img
                    src={`http://localhost:8081/uploads/auctions/${auction.imageFilename}`}
                    alt={auction.title}
                    className="auction-image"
                  />
                )}
                <div className="auction-info">
                  <h3>{auction.title}</h3>
                  <p className="auction-description">{auction.description}</p>
                  <div className="auction-details">
                    <span className="auction-price">
                      Lance atual: {formatCurrency(auction.currentPrice)}
                    </span>
                    <span className="auction-badge">{getStatusBadge(auction.status)}</span>
                  </div>
                  <div className="auction-meta">
                    <small>Vendedor: {auction.sellerName}</small>
                    <small>Início: {formatDate(auction.startDate)}</small>
                    <small>Fim: {formatDate(auction.endDate)}</small>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}