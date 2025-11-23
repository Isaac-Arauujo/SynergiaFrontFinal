// src/pages/InscricaoDetalhe.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, Trash2, Edit2, X, Check, XCircle } from 'lucide-react';
import { inscricaoService } from '../services/inscricaoService';
import { useAuth } from '../contexts/AuthContext';
import '../style/inscricaodetalhe.css';

export default function InscricaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ descricao: '', imagemUrl: '' });

  // state para modais
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    carregar();
    // eslint-disable-next-line
  }, [id]);

  const carregar = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await inscricaoService.buscarPorId(id);
      setInscricao(data);
      setForm({
        descricao: data?.descricao || data?.observacao || '',
        imagemUrl: data?.imagemUrl || data?.usuarioFoto || ''
      });
    } catch (err) {
      console.error('Erro carregar inscrição:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // salvar edição (se backend aceitar PUT /api/inscricoes/{id} para atualizar)
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        descricao: form.descricao,
        imagemUrl: form.imagemUrl
      };
      // alguns backends devolvem o objeto atualizado; se não, recarrega
      await inscricaoService.atualizar ? await inscricaoService.atualizar(id, payload) : null;
      // se não houver método atualizar no service, você pode usar outro endpoint apropriado.
      await carregar();
      setEditing(false);
    } catch (err) {
      console.error('Erro ao salvar inscrição:', err);
      setError(err?.response?.data?.message || 'Erro ao salvar inscrição');
    } finally {
      setSaving(false);
    }
  };

  // confirmar (aprovar)
  const handleConfirmar = async () => {
    try {
      setSaving(true);
      setError('');
      await inscricaoService.confirmar(id);
      await carregar();
      setConfirmApproveOpen(false);
    } catch (err) {
      console.error('Erro ao confirmar inscrição:', err);
      setError(err?.response?.data?.message || 'Erro ao confirmar inscrição');
    } finally {
      setSaving(false);
    }
  };

  // recusar
  const handleRecusar = async () => {
    try {
      setSaving(true);
      setError('');
      // envia motivo opcional como payload
      await inscricaoService.recusar(id, { motivo: rejectReason });
      await carregar();
      setConfirmRejectOpen(false);
      setRejectReason('');
    } catch (err) {
      console.error('Erro ao recusar inscrição:', err);
      setError(err?.response?.data?.message || 'Erro ao recusar inscrição');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      setError('');
      await inscricaoService.excluir(id);
      // volta pra lista
      navigate('/inscricoes');
    } catch (err) {
      console.error('Erro ao excluir inscrição:', err);
      setError(err?.response?.data?.message || 'Erro ao excluir inscrição');
    } finally {
      setSaving(false);
      setConfirmDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <Loader className="animate-spin" size={36} />
        <p>Carregando inscrição...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <p>{error}</p>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => carregar()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  if (!inscricao) {
    return <div className="detail-empty">Inscrição não encontrada.</div>;
  }

  const isAdmin = !!usuario?.isAdmin;

  return (
    <main className="inscricao-detail container">
      <div className="detail-card">
        <div className="detail-header">
          <h2>Detalhe da Inscrição</h2>

          <div className="actions">
            {isAdmin && (
              <>
                <button title="Aprovar" onClick={() => setConfirmApproveOpen(true)} className="icon-btn approve" >
                  <Check />
                </button>

                <button title="Recusar" onClick={() => setConfirmRejectOpen(true)} className="icon-btn reject" >
                  <XCircle />
                </button>

                <button title="Excluir" onClick={() => setConfirmDeleteOpen(true)} className="icon-btn danger" >
                  <Trash2 />
                </button>

                <button title="Editar" onClick={() => setEditing(true)} className="icon-btn">
                  <Edit2 />
                </button>
              </>
            )}
            <button title="Fechar" onClick={() => navigate(-1)} className="icon-btn">
              <X />
            </button>
          </div>
        </div>

        <div className="detail-body">
          <div className="left">
            <div className="foto-wrap">
              { (inscricao.imagemUrl || inscricao.usuarioFoto) ? (
                <img src={inscricao.imagemUrl || inscricao.usuarioFoto} alt={inscricao.usuarioNome} />
              ) : (
                <div className="foto-placeholder">Sem imagem</div>
              )}
            </div>

            <div className="meta">
              <h3>{inscricao.usuarioNome}</h3>
              <p className="muted">{inscricao.usuarioEmail}</p>
              <p className="muted">{inscricao.usuarioTelefone}</p>
              <p><strong>Local:</strong> {inscricao.localNome}</p>
              <p><strong>Data desejada:</strong> {inscricao.dataDesejada || inscricao.data || '-'}</p>
              <p><strong>Status:</strong> {inscricao.status}</p>
            </div>
          </div>

          <div className="right">
            {!editing ? (
              <>
                <h4>Descrição</h4>
                <p className="descricao">{inscricao.descricao || inscricao.observacao || '—'}</p>
              </>
            ) : (
              <div className="edit-form">
                <label>Descrição</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} />

                <label>URL da Imagem</label>
                <input name="imagemUrl" value={form.imagemUrl} onChange={handleChange} />

                <div className="edit-actions">
                  <button className="btn" onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button className="btn outline" onClick={() => { setEditing(false); }} disabled={saving}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: confirmar exclusão */}
      {confirmDeleteOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirma exclusão?</h3>
            <p>Essa ação é irreversível. Deseja realmente excluir esta inscrição?</p>
            <div className="modal-actions">
              <button className="btn danger" onClick={handleDelete} disabled={saving}>Excluir</button>
              <button className="btn outline" onClick={() => setConfirmDeleteOpen(false)} disabled={saving}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: confirmar aprovação */}
      {confirmApproveOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirmar inscrição</h3>
            <p>Deseja confirmar (aprovar) esta inscrição?</p>
            <div className="modal-actions">
              <button className="btn" onClick={handleConfirmar} disabled={saving}>Confirmar</button>
              <button className="btn outline" onClick={() => setConfirmApproveOpen(false)} disabled={saving}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: confirmar recusa (com motivo) */}
      {confirmRejectOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Recusar inscrição</h3>
            <p>Informe o motivo da recusa (opcional):</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} style={{ width: '100%', minHeight: 80, marginTop: 8 }} />
            <div className="modal-actions">
              <button className="btn danger" onClick={handleRecusar} disabled={saving}>Recusar</button>
              <button className="btn outline" onClick={() => setConfirmRejectOpen(false)} disabled={saving}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
