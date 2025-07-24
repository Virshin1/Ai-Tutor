import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Copy, 
  FileText, 
  BookOpen, 
  Target, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  List, 
  MapPin,
  Calendar,
  X,
  Plus,
  Save,
  BarChart3,
  ClipboardList
} from 'lucide-react';
import '../index.css';

interface DashboardSummary {
  lessonPlans: number;
  rubrics: number;
  ieps: number;
  exitTickets: number;
  reportComments: number;
  assignments: number;
  directions: number;
  total: number;
}

interface DashboardItem {
  _id: string;
  title?: string;
  subject?: string;
  gradeLevel?: string;
  studentName?: string;
  topic?: string;
  activity?: string;
  createdAt: string;
  type: string;
}

interface SearchFilters {
  q: string;
  subject: string;
  gradeLevel: string;
  startDate: string;
  endDate: string;
}

const EnhancedDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    q: '',
    subject: '',
    gradeLevel: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; title: string } | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDuplicateNotification, setShowDuplicateNotification] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, searchFilters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch summary data
      const summaryResponse = await fetch('/api/dashboard/summary');
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      // Fetch recent items from all tools
      const [lessonPlans, rubrics, ieps, exitTickets, reportComments, assignments, directions] = await Promise.all([
        fetch('/api/dashboard/lesson-plans').then(res => res.json()),
        fetch('/api/dashboard/rubrics').then(res => res.json()),
        fetch('/api/dashboard/ieps').then(res => res.json()),
        fetch('/api/dashboard/exit-tickets').then(res => res.json()),
        fetch('/api/dashboard/report-comments').then(res => res.json()),
        fetch('/api/dashboard/assignments').then(res => res.json()),
        fetch('/api/dashboard/directions').then(res => res.json())
      ]);

      // Combine and sort all items
      const allItems = [
        ...lessonPlans.map((item: any) => ({ ...item, type: 'lesson-plan' })),
        ...rubrics.map((item: any) => ({ ...item, type: 'rubric' })),
        ...ieps.map((item: any) => ({ ...item, type: 'iep' })),
        ...exitTickets.map((item: any) => ({ ...item, type: 'exit-ticket' })),
        ...reportComments.map((item: any) => ({ ...item, type: 'report-comment' })),
        ...assignments.map((item: any) => ({ ...item, type: 'assignment' })),
        ...directions.map((item: any) => ({ ...item, type: 'direction' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setItems(allItems);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Text search
    if (searchFilters.q) {
      const query = searchFilters.q.toLowerCase();
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.subject && item.subject.toLowerCase().includes(query)) ||
        (item.gradeLevel && item.gradeLevel.toLowerCase().includes(query)) ||
        (item.studentName && item.studentName.toLowerCase().includes(query)) ||
        (item.topic && item.topic.toLowerCase().includes(query)) ||
        (item.activity && item.activity.toLowerCase().includes(query))
      );
    }

    // Subject filter
    if (searchFilters.subject) {
      filtered = filtered.filter(item => item.subject === searchFilters.subject);
    }

    // Grade level filter
    if (searchFilters.gradeLevel) {
      filtered = filtered.filter(item => item.gradeLevel === searchFilters.gradeLevel);
    }

    // Date range filter
    if (searchFilters.startDate) {
      filtered = filtered.filter(item => new Date(item.createdAt) >= new Date(searchFilters.startDate));
    }
    if (searchFilters.endDate) {
      filtered = filtered.filter(item => new Date(item.createdAt) <= new Date(searchFilters.endDate));
    }

    setFilteredItems(filtered);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'lesson-plan':
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'rubric':
        return <Target className="h-5 w-5 text-green-400" />;
      case 'iep':
        return <Users className="h-5 w-5 text-purple-400" />;
      case 'exit-ticket':
        return <CheckCircle className="h-5 w-5 text-yellow-400" />;
      case 'report-comment':
        return <MessageSquare className="h-5 w-5 text-pink-400" />;
      case 'assignment':
        return <List className="h-5 w-5 text-indigo-400" />;
      case 'direction':
        return <MapPin className="h-5 w-5 text-orange-400" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getItemTitle = (item: DashboardItem) => {
    return item.title || item.topic || item.activity || item.studentName || 'Untitled';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleExport = async (itemId: string, type: string) => {
    try {
      const response = await fetch(`/api/export/${type}/${itemId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${itemId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting item:', error);
    }
  };

  const handleBulkExport = async () => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('/api/export/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems.map(id => {
            const item = items.find(i => i._id === id);
            return { type: item?.type, id };
          })
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'teaching-tools-export.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting items:', error);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: data })
      });

      const result = await response.json();
      alert(result.message);
      setShowImportModal(false);
      setImportFile(null);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error importing items:', error);
      alert('Error importing items. Please check the file format.');
    }
  };

  const handleDelete = async (itemId: string, type: string, title: string) => {
    setItemToDelete({ id: itemId, type, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await fetch(`/api/${itemToDelete.type}/${itemToDelete.id}`, {
        method: 'DELETE'
      });
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage(`"${itemToDelete.title}" has been deleted successfully`);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDuplicate = async (itemId: string, type: string, title: string) => {
    try {
      await fetch(`/api/${type}/${itemId}/duplicate`, {
        method: 'POST'
      });
      setDuplicateMessage(`"${title}" has been duplicated successfully`);
      setShowDuplicateNotification(true);
      setTimeout(() => setShowDuplicateNotification(false), 3000);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error duplicating item:', error);
    }
  };

  const handleEdit = async (item: DashboardItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      await fetch(`/api/${editingItem.type}/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem)
      });
      setEditingItem(null);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Accent color mapping for modals
  const getAccentColor = (type: string) => {
    switch (type) {
      case 'lesson-plan': return 'border-accentYellow';
      case 'rubric': return 'border-accentBlue';
      case 'iep': return 'border-accentPurple';
      case 'exit-ticket': return 'border-accentGreen';
      case 'report-comment': return 'border-accentPink';
      case 'assignment': return 'border-accentYellow';
      case 'direction': return 'border-accentBlue';
      default: return 'border-accentYellow';
    }
  };

  // Bulk delete implementation
  const confirmBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    try {
      await Promise.all(selectedItems.map(id => {
        const item = items.find(i => i._id === id);
        if (!item) return Promise.resolve();
        return fetch(`/api/${item.type}/${id}`, { method: 'DELETE' });
      }));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSelectedItems([]);
      setSuccessMessage('Selected items have been deleted successfully');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      fetchDashboardData();
    } catch (error) {
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSelectedItems([]);
      setSuccessMessage('Error deleting selected items');
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Overview Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-accentYellow p-4 flex items-center justify-center mb-2">
              <BarChart3 className="h-10 w-10" stroke="white" fill="none" />
            </div>
            <h1 className="text-3xl font-extrabold mb-1 text-center">Class Snapshot</h1>
            <p className="text-textSecondary text-center mb-4">Enhanced dashboard view with search, filtering, export, and content management</p>
            <div className="w-full border-b border-[#353945] mb-4"></div>
          </div>
          {/* Colorful Summary Cards */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
              <div className="bg-accentYellow/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <FileText className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.lessonPlans}</span>
                <span className="text-xs text-background/80">Lesson Plans</span>
              </div>
              <div className="bg-accentBlue/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <ClipboardList className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.rubrics}</span>
                <span className="text-xs text-background/80">Rubrics</span>
              </div>
              <div className="bg-accentPurple/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <Users className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.ieps}</span>
                <span className="text-xs text-background/80">IEPs</span>
              </div>
              <div className="bg-accentGreen/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <CheckCircle className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.exitTickets}</span>
                <span className="text-xs text-background/80">Exit Tickets</span>
              </div>
              <div className="bg-accentPink/90 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <MessageSquare className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.reportComments}</span>
                <span className="text-xs text-background/80">Comments</span>
              </div>
              <div className="bg-accentYellow/70 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <BookOpen className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.assignments}</span>
                <span className="text-xs text-background/80">Assignments</span>
              </div>
              <div className="bg-accentBlue/70 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform animate-fade-in">
                <List className="h-7 w-7 text-background mb-1" />
                <span className="font-bold text-lg text-background">{summary.directions}</span>
                <span className="text-xs text-background/80">Directions</span>
              </div>
            </div>
          )}
        </div>
        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-accentYellow mb-3">Recent Activity</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {filteredItems.slice(0, 5).map((item, idx) => (
              <div key={item._id} className="min-w-[260px] bg-card rounded-2xl border border-[#353945] shadow p-4 flex flex-col gap-2 animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-8 rounded-xl mr-2 ${item.type === 'lesson-plan' ? 'bg-accentYellow' : item.type === 'rubric' ? 'bg-accentBlue' : item.type === 'iep' ? 'bg-accentPurple' : item.type === 'exit-ticket' ? 'bg-accentGreen' : item.type === 'report-comment' ? 'bg-accentPink' : item.type === 'assignment' ? 'bg-accentYellow' : 'bg-accentBlue'}`}></div>
                  {getItemIcon(item.type)}
                  <span className="font-semibold text-textPrimary ml-1">{getItemTitle(item)}</span>
                </div>
                <div className="text-xs text-textSecondary mb-1">
                  {item.subject && `${item.subject} • `}
                  {item.gradeLevel && `${item.gradeLevel} • `}
                  {formatDate(item.createdAt)}
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full capitalize bg-background border border-[#353945] text-accentYellow w-fit">
                  {item.type.replace('-', ' ')}
                </span>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-slate-400 flex items-center justify-center h-20 px-4">No recent activity.</div>
            )}
          </div>
        </div>
        {/* All Items Section */}
        <h2 className="text-xl font-bold text-accentYellow mb-3">All Items</h2>
        {/* Filters Card */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 flex flex-wrap gap-2 items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchFilters.q}
                onChange={e => setSearchFilters(f => ({ ...f, q: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-background border border-[#353945] text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              />
            </div>
            {/* Add more filter inputs here as needed */}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="px-4 py-2 rounded-xl bg-accentYellow text-background font-semibold shadow hover:bg-[#181A20] hover:text-accentYellow transition-all duration-200"
          >
            <Filter className="h-5 w-5 mr-1 inline" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap gap-4 items-end animate-fade-in">
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-textSecondary mb-1">Subject</label>
              <select
                value={searchFilters.subject}
                onChange={e => setSearchFilters(f => ({ ...f, subject: e.target.value }))}
                className="w-full bg-background border border-[#353945] rounded-xl px-3 py-2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English Language Arts">English Language Arts</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Art">Art</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-textSecondary mb-1">Grade Level</label>
              <select
                value={searchFilters.gradeLevel}
                onChange={e => setSearchFilters(f => ({ ...f, gradeLevel: e.target.value }))}
                className="w-full bg-background border border-[#353945] rounded-xl px-3 py-2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              >
                <option value="">All Grades</option>
                <option value="K">Kindergarten</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
                <option value="Elementary">Elementary (K-5)</option>
                <option value="Middle School">Middle School (6-8)</option>
                <option value="High School">High School (9-12)</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs font-semibold text-textSecondary mb-1">Start Date</label>
              <input
                type="date"
                value={searchFilters.startDate}
                onChange={e => setSearchFilters(f => ({ ...f, startDate: e.target.value }))}
                className="w-full bg-background border border-[#353945] rounded-xl px-3 py-2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              />
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs font-semibold text-textSecondary mb-1">End Date</label>
              <input
                type="date"
                value={searchFilters.endDate}
                onChange={e => setSearchFilters(f => ({ ...f, endDate: e.target.value }))}
                className="w-full bg-background border border-[#353945] rounded-xl px-3 py-2 text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentYellow focus:border-accentYellow transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setSearchFilters({ q: '', subject: '', gradeLevel: '', startDate: '', endDate: '' })}
              className="px-4 py-2 rounded-xl bg-background border border-[#353945] text-textSecondary font-semibold shadow hover:bg-accentYellow hover:text-background transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between bg-card border border-accentYellow rounded-2xl shadow-lg px-6 py-3 mb-4 animate-fade-in">
            <span className="font-semibold text-accentYellow">{selectedItems.length} selected</span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkExport}
                className="px-4 py-2 rounded-xl bg-accentBlue text-background font-semibold shadow hover:bg-[#181A20] hover:text-accentBlue transition-all duration-200"
              >
                <Download className="h-5 w-5 inline mr-1" /> Export
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-accentPink text-background font-semibold shadow hover:bg-[#181A20] hover:text-accentPink transition-all duration-200"
              >
                <Trash2 className="h-5 w-5 inline mr-1" /> Delete
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 rounded-xl bg-background border border-[#353945] text-textSecondary font-semibold shadow hover:bg-accentYellow hover:text-background transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        {/* Items List Card */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Items ({filteredItems.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems(filteredItems.map(item => item._id))}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div 
                  key={item._id} 
                  className="flex items-center justify-between p-5 bg-card rounded-2xl border border-[#353945] shadow transition-all duration-200 hover:shadow-xl hover:border-accentYellow animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-10 rounded-xl mr-2 ${item.type === 'lesson-plan' ? 'bg-accentYellow' : item.type === 'rubric' ? 'bg-accentBlue' : item.type === 'iep' ? 'bg-accentPurple' : item.type === 'exit-ticket' ? 'bg-accentGreen' : item.type === 'report-comment' ? 'bg-accentPink' : item.type === 'assignment' ? 'bg-accentYellow' : 'bg-accentBlue'}`}></div>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleItemSelection(item._id)}
                      className="rounded border-[#353945] bg-background text-accentBlue focus:ring-accentBlue"
                    />
                    {getItemIcon(item.type)}
                    <div>
                      <p className="text-lg font-semibold text-textPrimary mb-0.5">{getItemTitle(item)}</p>
                      <p className="text-xs text-textSecondary">
                        {item.subject && `${item.subject} • `}
                        {item.gradeLevel && `${item.gradeLevel} • `}
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize bg-background border border-[#353945] text-accentYellow mr-2">
                      {item.type.replace('-', ' ')}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-textSecondary hover:text-accentBlue transition-all duration-200 transform hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(item._id, item.type, getItemTitle(item))}
                        className="p-1 text-textSecondary hover:text-accentGreen transition-all duration-200 transform hover:scale-110"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExport(item._id, item.type)}
                        className="p-1 text-textSecondary hover:text-accentYellow transition-all duration-200 transform hover:scale-110"
                        title="Export"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.type, getItemTitle(item))}
                        className="p-1 text-textSecondary hover:text-accentPink transition-all duration-200 transform hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No items found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className={`bg-card rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border-2 ${getAccentColor(editingItem.type)} animate-in zoom-in-95 duration-200`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${getAccentColor(editingItem.type).replace('border-', 'text-')}`}>Edit Item</h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-textSecondary hover:text-accentBlue transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">Title</label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-background border border-[#353945] rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingItem.subject || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, subject: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-background border border-[#353945] rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-1">Grade Level</label>
                  <input
                    type="text"
                    value={editingItem.gradeLevel || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, gradeLevel: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-background border border-[#353945] rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue focus:border-accentBlue transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2 rounded-xl bg-background border border-[#353945] text-textSecondary font-semibold shadow hover:bg-accentPink hover:text-background transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-accentBlue text-background font-bold shadow hover:bg-accentYellow hover:text-background transition-all duration-200"
                >
                  <Save className="h-5 w-5 inline mr-1" /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Import Items</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select JSON file to import
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <p className="text-sm text-slate-400">
                  The file should contain an array of items with type and data properties.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile}
                  className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className={`bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border-2 ${selectedItems.length > 1 ? 'border-accentPink' : itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '') : 'border-accentPink'} animate-in zoom-in-95 duration-200 flex flex-col items-center`}>
              <div className={`rounded-full ${selectedItems.length > 1 ? 'bg-accentPink/20' : itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '').replace('border-', 'bg-') + '/20' : 'bg-accentPink/20'} p-4 mb-4`}>
                <Trash2 className={`h-10 w-10 ${selectedItems.length > 1 ? 'text-accentPink' : itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '').replace('border-', 'text-') : 'text-accentPink'}`} />
              </div>
              <h3 className={`text-xl font-bold ${selectedItems.length > 1 ? 'text-accentPink' : itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '').replace('border-', 'text-') : 'text-accentPink'} mb-2`}>Delete Item{selectedItems.length > 1 ? 's' : ''}</h3>
              <p className="text-textPrimary text-center mb-2">
                Are you sure you want to delete {selectedItems.length > 1 ? 'these items' : 'this item'}?
              </p>
              {itemToDelete && (
                <p className={`font-semibold mb-2 ${itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '').replace('border-', 'text-') : 'text-accentPink'}`}>"{itemToDelete.title}"</p>
              )}
              {selectedItems.length <= 1 && <p className="text-xs text-textSecondary mb-4">This action cannot be undone.</p>}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                  className="px-5 py-2 rounded-xl bg-background border border-[#353945] text-textSecondary font-semibold shadow hover:bg-accentPink hover:text-background transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedItems.length > 1 ? confirmBulkDelete : confirmDelete}
                  className={`px-5 py-2 rounded-xl ${selectedItems.length > 1 ? 'bg-accentPink' : itemToDelete ? getAccentColor(items.find(i => i._id === itemToDelete.id)?.type || '').replace('border-', 'bg-') : 'bg-accentPink'} text-background font-bold shadow hover:bg-accentYellow hover:text-background transition-all duration-200`}
                >
                  <Trash2 className="h-5 w-5 inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Duplicate Success Notification */}
        {showDuplicateNotification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <Copy className="h-5 w-5" />
              <span>{duplicateMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard; 