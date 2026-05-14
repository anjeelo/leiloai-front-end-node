// leiloai-frontend/src/pages/AuctionDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import BidForm from '../components/BidForm';
import './AuctionDetail.css';

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  createdAt: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  initialPrice: number;
  currentPrice: number;
  startDate: string;
  endDate: string;
  status: string;
  sellerId: string;
  sellerName: string;
  winnerId: string | null;
  winnerName: string | null;
  imageFilename: string | null;
}

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAuction();
    loadBids();
  }, [id]);

  const loadAuction = async () => {
    try {
      const response = await api.get(`/auctions/${id}`);
      setAuction(response.data);
    } catch (err: any) {
      setError('Erro ao carregar leilão');
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const response = await api.get(`/auctions/${id}/bids`);
      setBids(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar lances:', err);
    }
  };

  const handleBidPlaced = () => {
    loadAuction();
    loadBids();
  };

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar este leilão?')) return;
    try {
      await api.patch(`/auctions/${id}/cancel`);
      loadAuction();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar leilão');
    }
  };

  const handleClose = async () => {
    if (!confirm('Tem certeza que deseja fechar este leilão?')) return;
    try {
      await api.patch(`/auctions/${id}/close`);
      loadAuction();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao fechar leilão');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) return <div className="container">Carregando...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!auction) return <div className="container">Leilão não encontrado</div>;

  const isSeller = user?.id === auction.sellerId;
  const isOpen = auction.status === 'OPEN';

  return (
    <div className="container">
      <button onClick={() => navigate('/auctions')} className="btn btn-back">
        ← Voltar
      </button>

      <div className="auction-detail">
        <div className="auction-main">
          {auction.imageFilename && (
            <img
              src={`http://localhost:8081/uploads/auctions/${auction.imageFilename}`}
              alt={auction.title}
              className="auction-detail-image"
            />
          )}
          <h1>{auction.title}</h1>
          <p className="auction-detail-description">{auction.description}</p>

          <div className="auction-prices">
            <div className="price-box">
              <span>Preço Inicial</span>
              <strong>{formatCurrency(auction.initialPrice)}</strong>
            </div>
            <div className="price-box current">
              <span>Lance Atual</span>
              <strong>{formatCurrency(auction.currentPrice)}</strong>
            </div>
          </div>

          <div className="auction-dates">
            <p>Início: {formatDate(auction.startDate)}</p>
            <p>Fim: {formatDate(auction.endDate)}</p>
            <p>Status: {auction.status === 'OPEN' ? '🟢 Aberto' : auction.status === 'CLOSED' ? '🔴 Fechado' : '⚫ Cancelado'}</p>
            <p>Vendedor: {auction.sellerName}</p>
            {auction.winnerName && <p>Vencedor: 🏆 {auction.winnerName}</p>}
          </div>

          {isSeller && isOpen && (
            <div className="auction-actions">
              <button onClick={handleClose} className="btn btn-success">
                Fechar Leilão
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                Cancelar Leilão
              </button>
            </div>
          )}
        </div>

        <div className="auction-sidebar">
          {isOpen && !isSeller && <BidForm auctionId={auction.id} onBidPlaced={handleBidPlaced} />}
          
          <div className="bids-section">
            <h3>Lances ({bids.length})</h3>
            {bids.length === 0 ? (
              <p className="no-bids">Nenhum lance ainda.</p>
            ) : (
              <div className="bids-list">
                {bids.map((bid, index) => (
                  <div key={bid.id} className={`bid-item ${index === 0 ? 'top-bid' : ''}`}>
                    <div className="bid-header">
                      <span className="bid-bidder">{bid.bidderName}</span>
                      {index === 0 && <span className="bid-crown">👑</span>}
                    </div>
                    <span className="bid-amount">{formatCurrency(bid.amount)}</span>
                    <small className="bid-date">{formatDate(bid.createdAt)}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}