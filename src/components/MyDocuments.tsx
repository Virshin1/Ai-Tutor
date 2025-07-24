import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Download, Trash2, ClipboardList, Users, CheckCircle, MessageSquare, BookOpen, List, X } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  type?: string;
  createdAt: string;
  content: string;
  formData?: any;
}

const typeMeta: Record<string, { icon: any; color: string; label: string }> = {
  'Lesson Plan': { icon: FileText, color: 'bg-accentYellow', label: 'Lesson Plan' },
  'Rubric': { icon: ClipboardList, color: 'bg-accentBlue', label: 'Rubric' },
  'IEP': { icon: Users, color: 'bg-accentPurple', label: 'IEP' },
  'Exit Ticket': { icon: CheckCircle, color: 'bg-accentGreen', label: 'Exit Ticket' },
  'Report Comment': { icon: MessageSquare, color: 'bg-accentPink', label: 'Report Comment' },
  'Assignment': { icon: BookOpen, color: 'bg-accentOrange', label: 'Assignment' },
  'Directions': { icon: List, color: 'bg-accentBlue', label: 'Directions' },
  'Document': { icon: FileText, color: 'bg-accentYellow', label: 'Document' },
};

const MyDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Document | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError('Could not load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    (doc.type || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc._id);
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: doc.content,
          toolName: doc.title,
          formData: doc.formData,
          type: doc.type || 'document',
        }),
      });
      if (!response.ok) throw new Error('Failed to export PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setToast('Downloaded PDF!');
    } catch (err) {
      setToast('Failed to download PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (doc: Document) => {
    setDeletingId(doc._id);
    try {
      const response = await fetch(`/api/documents/${doc._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setToast('Document deleted!');
      await fetchDocuments();
    } catch (err) {
      setToast('Failed to delete document.');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-accentBlue text-background px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
            {toast}
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-textPrimary mb-2">My Documents</h1>
          <p className="text-textSecondary">Manage your saved teaching materials</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or type..."
              className="w-full bg-card text-textPrimary border border-[#353945] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200 placeholder:text-textSecondary shadow"
            />
          </div>
        </div>
        <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-[#23262F]">
          <div className="px-6 py-4 bg-[#23262F] border-b border-[#353945]">
            <h2 className="text-lg font-semibold text-textPrimary">Saved Documents</h2>
          </div>
          {loading ? (
            <div className="p-6 text-textSecondary">Loading...</div>
          ) : error ? (
            <div className="p-6 text-red-400">{error}</div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-textSecondary">
              <FileText className="h-16 w-16 mb-4 text-[#353945]" />
              <div className="text-xl font-semibold mb-2">No documents found</div>
              <div className="text-textSecondary">Try generating or saving a new document!</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#23262F]">
              {filteredDocs.map((doc, idx) => {
                const meta = typeMeta[doc.type || 'Document'] || typeMeta['Document'];
                const Icon = meta.icon;
                return (
                  <div
                    key={doc._id}
                    className={`group flex items-center gap-4 px-6 py-5 cursor-pointer transition-all hover:bg-[#23262F] relative rounded-none`}
                    onClick={() => setSelectedDoc(doc)}
                    style={{ borderLeft: idx % 2 === 1 ? '1px solid #353945' : undefined }}
                  >
                    <div className={`rounded-xl ${meta.color} p-2 flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-textPrimary font-semibold truncate">{doc.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-textSecondary mt-1">
                        <span>{meta.label}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                        <span>{(doc.content.length / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-2 text-textSecondary hover:text-accentBlue transition-colors ${downloadingId === doc._id ? 'opacity-60 pointer-events-none' : ''}`}
                        onClick={e => { e.stopPropagation(); handleDownload(doc); }}
                        disabled={downloadingId === doc._id}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className={`p-2 text-textSecondary hover:text-red-400 transition-colors ${deletingId === doc._id ? 'opacity-60 pointer-events-none' : ''}`}
                        onClick={e => { e.stopPropagation(); setConfirmDelete(doc); }}
                        disabled={deletingId === doc._id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Preview Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in border border-[#23262F]">
              <button
                className="absolute top-4 right-4 text-textSecondary hover:text-accentBlue"
                onClick={() => setSelectedDoc(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-xl ${typeMeta[selectedDoc.type || 'Document']?.color || 'bg-accentYellow'} p-2 shadow-lg`}>
                  {React.createElement(typeMeta[selectedDoc.type || 'Document']?.icon || FileText, { className: 'h-6 w-6 text-background' })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-textPrimary mb-1">{selectedDoc.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-textSecondary">
                    <span>{typeMeta[selectedDoc.type || 'Document']?.label || 'Document'}</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(selectedDoc.createdAt).toLocaleDateString()}
                    </span>
                    <span>{(selectedDoc.content.length / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto bg-background rounded-xl p-4 text-textPrimary whitespace-pre-wrap border border-[#353945]">
                {selectedDoc.content}
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in border border-[#23262F]">
              <button
                className="absolute top-4 right-4 text-textSecondary hover:text-accentBlue"
                onClick={() => setConfirmDelete(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex flex-col items-center gap-4">
                <Trash2 className="h-12 w-12 text-red-400 mb-2" />
                <div className="text-xl font-bold text-textPrimary mb-2 text-center">Delete this document?</div>
                <div className="text-textSecondary mb-4 text-center">This action cannot be undone.</div>
                <div className="flex gap-4">
                  <button
                    className="px-5 py-2 rounded-xl bg-background text-textPrimary hover:bg-[#23262F] transition border border-[#353945]"
                    onClick={() => setConfirmDelete(null)}
                    disabled={deletingId === confirmDelete._id}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold shadow"
                    onClick={() => handleDelete(confirmDelete)}
                    disabled={deletingId === confirmDelete._id}
                  >
                    {deletingId === confirmDelete._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;