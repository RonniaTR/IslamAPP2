import React, { useState, useEffect } from 'react';
import { FirestoreService } from '../services/FirestoreService';

function AdminPage() {
  const [contentType, setContentType] = useState('category');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    coverImage: '',
    difficulty: 'beginner',
    status: 'published',
    isPremium: false,
    order: 0,
    icon: '', // For category
    seriesId: '', // For lesson
    content: '', // For lesson/article
  });

  useEffect(() => {
    fetchItems();
  }, [contentType]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const collectionMap = {
        'category': 'categories',
        'theme': 'themes',
        'series': 'series',
        'article': 'articles',
        'lesson': 'lessons',
        'audio': 'audio'
      };
      const service = new FirestoreService(collectionMap[contentType]);
      const data = await service.getAll();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching admin content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, tags: [], type: contentType };
      // Parse order as int
      payload.order = parseInt(payload.order, 10) || 0;

      const collectionMap = {
        'category': 'categories',
        'theme': 'themes',
        'series': 'series',
        'article': 'articles',
        'lesson': 'lessons',
        'audio': 'audio'
      };
      const service = new FirestoreService(collectionMap[contentType]);
      await service.create(payload);
      
      alert(`${contentType} created successfully!`);
      fetchItems(); // refresh list
      // Reset basic fields
      setFormData(prev => ({ ...prev, slug: '', title: '', description: '' }));
    } catch (err) {
      console.error('Create error:', err);
      alert('Error creating content. Check console.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">CMS Yönetim Paneli</h1>
      <p className="text-gray-400 mb-6">Bu alandan eklenen içerikler anında Keşfet sayfasında güncellenir. React kodu değiştirmenize gerek yoktur.</p>

      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        {['category', 'theme', 'series', 'lesson', 'article', 'audio'].map(type => (
          <button
            key={type}
            onClick={() => setContentType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              contentType === type ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Yeni {contentType.toUpperCase()} Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Başlık (Title)</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug (URL için)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Açıklama (Description)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" rows="3"></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kapak Resmi URL (Cover Image)</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Durum</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none">
                  <option value="draft">Taslak (Draft)</option>
                  <option value="published">Yayınla (Published)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sıra (Order)</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
              </div>
            </div>

            <label className="flex items-center space-x-3 text-gray-300">
              <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 focus:ring-offset-gray-900" />
              <span>Premium İçerik</span>
            </label>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-6">
              Kaydet ve Yayınla
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Mevcut {contentType.toUpperCase()} İçerikleri</h2>
          {loading ? (
            <p className="text-gray-400">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">Henüz içerik eklenmemiş.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">/{item.slug} • {item.status}</p>
                  </div>
                  <div className="flex space-x-2">
                    {item.isPremium && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">PRO</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
