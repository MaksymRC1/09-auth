import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { FetchNotesParams, FetchNotesResponse } from './clientApi';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params?: FetchNotesParams): Promise<FetchNotesResponse> => {
  const options = await getAuthHeaders();
  const response = await api.get<FetchNotesResponse>('/notes', { ...options, params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const options = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, options);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const options = await getAuthHeaders();
  const response = await api.get<User>('/users/me', options);
  return response.data;
};

import { AxiosResponse } from 'axios';

export const checkSession = async (): Promise<AxiosResponse<User> | null> => {
  try {
    const options = await getAuthHeaders();
    return await api.get<User>('/auth/session', options);
  } catch (error) {
    return null;
  }
};
