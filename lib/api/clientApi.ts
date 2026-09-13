import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params?: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  note: Pick<Note, 'title' | 'content' | 'tag'>
): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export interface AuthCredentials {
  email: string;
  password: string;
}

export const register = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/register', credentials);
  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

import { AxiosResponse } from 'axios';

export const checkSession = async (): Promise<AxiosResponse<User> | null> => {
  try {
    return await api.get<User>('/auth/session');
  } catch (error) {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (userUpdate: Pick<User, 'username'>): Promise<User> => {
  const response = await api.patch<User>('/users/me', userUpdate);
  return response.data;
};
