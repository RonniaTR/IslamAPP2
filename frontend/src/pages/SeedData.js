import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import hadithData from '../data/hadiths.json';

const MOCK_CATEGORIES = [
  { id: 'quran', title: "Kur'an", icon: 'BookOpen', order: 1, status: 'published' },
  { id: 'dua', title: "Dua & Zikir", icon: 'Heart', order: 2, status: 'published' },
  { id: 'hadith', title: "Hadisler", icon: 'Star', order: 3, status: 'published' },
  { id: 'siyer', title: "Siyer", icon: 'Moon', order: 4, status: 'published' },
  { id: 'ilmihal', title: "İlmihal", icon: 'Book', order: 5, status: 'published' },
  { id: 'fikih', title: "Fıkıh", icon: 'Scale', order: 6, status: 'published' },
];

const MOCK_ARTICLES = [
  {
    id: 'sabah-zikirleri',
    title: 'Sabah Zikirleri',
    slug: 'sabah-zikirleri',
    subtitle: 'Güne bereketle başla',
    content: 'Sabah kalktığınızda okumanız tavsiye edilen zikirler...',
    coverImage: 'https://images.unsplash.com/photo-1584281722976-155e886d9a91?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
    badge: 'ÖNERİLEN'
  },
  {
    id: 'namaza-hazirlik',
    title: 'Namaza Hazırlık',
    slug: 'namaza-hazirlik',
    subtitle: '5 adımda hazırlık',
    content: 'Namaz öncesi bedeni ve ruhi hazırlık aşamaları...',
    coverImage: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
    badge: 'YENİ'
  },
  {
    id: 'tevekkul-nedir',
    title: 'Tevekkül Nedir?',
    slug: 'tevekkul-nedir',
    subtitle: 'Yeni makale',
    content: 'Tevekkülün İslamdaki yeri ve önemi...',
    coverImage: 'https://images.unsplash.com/photo-1609599006353-e629aaab31f5?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
    badge: 'SANA ÖZEL'
  },
  {
    id: 'iman-testi',
    title: 'İman Testi',
    slug: 'iman-testi',
    subtitle: 'Bilgini ölç',
    content: 'Temel itikat konularını içeren 10 soruluk test...',
    coverImage: 'https://images.unsplash.com/photo-1574246604907-db69e30fd797?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
    badge: 'TEST'
  }
];

const MOCK_SERIES = [
  {
    id: 'ramazan-gunlukleri',
    title: 'Ramazan Günlükleri',
    slug: 'ramazan-gunlukleri',
    coverImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: '40-hadis',
    title: '40 Hadis',
    slug: '40-hadis',
    coverImage: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'iman-yolculugu',
    title: 'İman Yolculuğu',
    slug: 'iman-yolculugu',
    coverImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'peygamber-kissalari',
    title: 'Peygamber Kıssaları',
    slug: 'peygamber-kissalari',
    coverImage: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?q=80&w=600&auto=format&fit=crop',
    status: 'published',
    createdAt: new Date().toISOString(),
  }
];

const MOCK_AUDIO = [
  {
    id: 'sabah-dualari',
    title: 'Sabah Duaları',
    slug: 'sabah-dualari',
    durationSeconds: 765, // 12:45
    audioUrl: 'https://example.com/audio1.mp3',
    color: 'bg-[#153B2D]',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yasin-suresi',
    title: 'Yasin Suresi',
    slug: 'yasin-suresi',
    durationSeconds: 1338, // 22:18
    audioUrl: 'https://example.com/audio2.mp3',
    color: 'bg-[#31224A]',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mulk-suresi',
    title: 'Mülk Suresi',
    slug: 'mulk-suresi',
    durationSeconds: 632, // 10:32
    audioUrl: 'https://example.com/audio3.mp3',
    color: 'bg-[#564219]',
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rahman-suresi',
    title: 'Rahman Suresi',
    slug: 'rahman-suresi',
    durationSeconds: 730, // 12:10
    audioUrl: 'https://example.com/audio4.mp3',
    color: 'bg-[#1B3A42]',
    status: 'published',
    createdAt: new Date().toISOString(),
  }
];

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const seedCollection = async (collectionName, items) => {
    addLog(`Seeding ${collectionName}...`);
    for (const item of items) {
      try {
        await setDoc(doc(db, collectionName, item.id), item, { merge: true });
        addLog(`✅ Added ${collectionName}/${item.id}`);
      } catch (e) {
        addLog(`❌ Failed to add ${item.id}: ${e.message}`);
      }
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    setLogs([]);
    
    await seedCollection('categories', MOCK_CATEGORIES);
    await seedCollection('articles', MOCK_ARTICLES);
    await seedCollection('series', MOCK_SERIES);
    await seedCollection('audio', MOCK_AUDIO);

    addLog('Seeding 500 Hadiths from JSON...');
    try {
      const topHadiths = hadithData.slice(0, 500);
      let count = 0;
      for (const h of topHadiths) {
        // Prepare the clean document
        const cleanHadith = {
          id: h.id || `hadith-${count}`,
          arabic: h.arabic || '',
          turkish: h.turkish || '',
          source: h.source || 'Unknown',
          book: h.book || '',
          bookTr: h.bookTr || '',
          number: h.number || '',
          narrator: h.narrator || '',
          grade: h.grade || '',
          category: h.category || '',
          theme: h.theme || '',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'hadiths', cleanHadith.id), cleanHadith, { merge: true });
        count++;
        if (count % 50 === 0) {
          addLog(`✅ Seeded ${count}/500 hadiths...`);
        }
      }
      addLog('✅ Finished seeding 500 Hadiths!');
    } catch (err) {
      addLog(`❌ Failed to seed hadiths: ${err.message}`);
    }

    addLog('🎉 All seeding completed successfully!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#052A1E] text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Database Seeder</h1>
      <p className="mb-8 text-gray-300">Click the button below to populate Firestore with high quality mock data (Categories, Articles, Series, Audio).</p>
      
      <button 
        onClick={handleSeed} 
        disabled={loading}
        className="bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#059669] disabled:opacity-50 transition-all"
      >
        {loading ? 'Seeding Database...' : 'Start Seeding'}
      </button>

      <div className="mt-8 bg-black/50 p-4 rounded-xl font-mono text-sm h-96 overflow-y-auto">
        {logs.map((l, i) => (
          <div key={i} className="mb-1">{l}</div>
        ))}
        {logs.length === 0 && <div className="text-gray-500">Logs will appear here...</div>}
      </div>
    </div>
  );
}
