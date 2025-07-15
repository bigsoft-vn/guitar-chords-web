// Use relative URL when frontend and backend are on same domain
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export interface Song {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  lyrics: string;
  tempo: number;
  genre?: string;
  difficulty: string;
  chordProgression?: string;
  key?: string;
  capo?: number;
  strummingPattern?: string;
  duration?: number;
  playCount: number;
  chords: Array<{
    id: number;
    name: string;
    positions: number[];
    fingers: number[];
    difficulty: string;
    position: number;
    line: number;
  }>;
}

export interface Chord {
  id: number;
  name: string;
  positions: number[];
  fingers: number[];
  description?: string;
  difficulty: string;
  tips: string[];
}

export interface SearchResult {
  type: 'song' | 'chord' | 'artist';
  id: number;
  title: string;
  artist?: string;
  matchPercentage: number;
  chords?: string[];
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (data === null || data === undefined) {
        throw new Error('API returned null or undefined data');
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Return empty data for common endpoints to prevent app crashes
      if (endpoint.includes('/songs/recent')) {
        return [] as unknown as T;
      }
      if (endpoint.includes('/chords') && endpoint.split('/').length === 2) {
        return [] as unknown as T;
      }
      if (endpoint.includes('/search')) {
        return [] as unknown as T;
      }
      
      throw error;
    }
  }

  // Songs
  async getRecentSongs(limit = 5): Promise<Song[]> {
    return this.request(`/songs/recent?limit=${limit}`);
  }

  async getSongById(id: string): Promise<Song> {
    return this.request(`/songs/${id}`);
  }

  async getAllSongs(page = 1, limit = 10, filters?: {
    genre?: string;
    difficulty?: string;
    artistId?: number;
  }): Promise<{
    songs: Song[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.artistId) params.append('artistId', filters.artistId.toString());

    return this.request(`/songs?${params.toString()}`);
  }

  // Chords
  async getAllChords(difficulty?: string): Promise<Chord[]> {
    const params = difficulty ? `?difficulty=${difficulty}` : '';
    return this.request(`/chords${params}`);
  }

  async getChordByName(name: string): Promise<Chord> {
    return this.request(`/chords/${encodeURIComponent(name)}`);
  }

  async getSongsWithChord(chordName: string, limit = 10): Promise<Array<{
    id: number;
    title: string;
    artist: string;
    difficulty: string;
    playCount: number;
  }>> {
    return this.request(`/chords/${encodeURIComponent(chordName)}/songs?limit=${limit}`);
  }

  // Artists
  async getAllArtists(page = 1, limit = 20): Promise<{
    artists: Array<{
      id: number;
      name: string;
      bio?: string;
      imageUrl?: string;
      songCount: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    return this.request(`/artists?page=${page}&limit=${limit}`);
  }

  async getArtistById(id: number): Promise<{
    id: number;
    name: string;
    bio?: string;
    imageUrl?: string;
    songs: Array<{
      id: number;
      title: string;
      difficulty: string;
      genre?: string;
      playCount: number;
      chords: string[];
    }>;
  }> {
    return this.request(`/artists/${id}`);
  }

  // Search
  async search(query: string, type?: 'song' | 'chord' | 'artist'): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    
    return this.request(`/search?${params.toString()}`);
  }

  async getPopularSearches(): Promise<{
    popularSongs: Array<{
      type: 'song';
      id: number;
      title: string;
      artist: string;
      playCount: number;
      chords: string[];
    }>;
    popularChords: Array<{
      type: 'chord';
      id: number;
      name: string;
      difficulty: string;
      usageCount: number;
    }>;
  }> {
    return this.request('/search/popular');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;