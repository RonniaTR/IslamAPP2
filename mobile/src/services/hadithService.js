import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'https://ronnia.pythonanywhere.com';

let cachedHadiths = null;

// Fetch all hadiths from backend
async function fetchAllHadiths() {
  if (cachedHadiths) {
    return cachedHadiths;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/hadiths`);
    cachedHadiths = response.data;
    return cachedHadiths;
  } catch (error) {
    console.error('Failed to fetch hadiths from backend:', error);
    // Return empty array if backend fails
    return [];
  }
}

// Available hadith categories
export function getHadithCategories() {
  return [
    'Tümü',
    'Iman',
    'Ahlak',
    'Namaz',
    'Oruç',
    'Zekat',
    'Hac',
    'Kur\'an',
    'Dua',
    'Temizlik',
    'Kalp',
    'Sadaka',
    'Kardeşlik',
    'Yardımlaşma',
    'Muamelat',
    'Şükür'
  ];
}

// Get available hadith sources
export function getHadithSources() {
  return [
    'Tümü',
    'Sahih al-Bukhari',
    'Sahih Muslim',
    'Jami at-Tirmidhi',
    'Sunan Abu Dawud',
    'Sunan an-Nasa\'i',
    'Sunan Ibn Majah'
  ];
}

// Fetch paginated hadiths with optional filtering
export async function fetchHadithPage(options = {}) {
  const {
    page = 1,
    pageSize = 20,
    category = 'Tümü',
    source = 'Tümü',
    query = ''
  } = options;

  try {
    const allHadiths = await fetchAllHadiths();
    let filtered = [...allHadiths];

    // Apply category filter
    if (category && category !== 'Tümü') {
      filtered = filtered.filter(h => h.category === category);
    }

    // Apply source filter
    if (source && source !== 'Tümü') {
      filtered = filtered.filter(h => h.source === source);
    }

    // Apply search query (search in turkish, english, arabic, narrator)
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(h => 
        h.turkish.toLowerCase().includes(lowerQuery) ||
        h.english.toLowerCase().includes(lowerQuery) ||
        h.arabic.includes(query) ||
        h.narrator.toLowerCase().includes(lowerQuery) ||
        h.theme.toLowerCase().includes(lowerQuery) ||
        h.bookTr.toLowerCase().includes(lowerQuery)
      );
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages
    };

  } catch (error) {
    console.error('Hadith fetch error:', error);
    throw error;
  }
}

// Get single hadith by ID
export async function fetchHadithById(id) {
  const allHadiths = await fetchAllHadiths();
  const hadith = allHadiths.find(h => h.id === id);
  if (!hadith) throw new Error('Hadith not found');
  return hadith;
}

// Get random hadith of the day
export async function getHadithOfDay() {
  const allHadiths = await fetchAllHadiths();
  if (allHadiths.length === 0) return null;
  
  // Use current date to get consistent random hadith for the day
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  const index = seed % allHadiths.length;
  
  return allHadiths[index];
}

// Get hadiths by narrator
export async function getHadithsByNarrator(narrator) {
  const allHadiths = await fetchAllHadiths();
  return allHadiths.filter(h => 
    h.narrator.toLowerCase().includes(narrator.toLowerCase())
  );
}

// Get statistics about hadith collection
export async function getHadithStats() {
  const allHadiths = await fetchAllHadiths();
  
  const stats = {
    total: allHadiths.length,
    bySources: {},
    byCategories: {},
    byGrades: {},
    narrators: new Set()
  };

  allHadiths.forEach(hadith => {
    // Count by source
    stats.bySources[hadith.source] = (stats.bySources[hadith.source] || 0) + 1;
    
    // Count by category
    stats.byCategories[hadith.category] = (stats.byCategories[hadith.category] || 0) + 1;
    
    // Count by grade
    stats.byGrades[hadith.grade] = (stats.byGrades[hadith.grade] || 0) + 1;
    
    // Collect unique narrators
    stats.narrators.add(hadith.narrator);
  });

  stats.narrators = Array.from(stats.narrators);
  
  return stats;
}
