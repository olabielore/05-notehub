import axios from "axios";
import type { Note } from "../types/note.ts";

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const  BASE_URL = "https://notehub-public.goit.study/api";

interface FetchNotesProps {
  page: number;
  perPage: number;
  search?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes({ page, perPage, search} : FetchNotesProps): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(
    `${BASE_URL}/notes`,
    {
      params: {
        page,
        perPage,
        search,
      },
      headers: {
        Authorization: `Bearer ${NOTEHUB_TOKEN}`,
      },
    }
  );

  return response.data;
};

export async function createNote({ title, content, tag }: CreateNoteProps): Promise<Note> {
  const response = await axios.post<Note>(
    `${BASE_URL}/notes`,
    {
        title,
        content,
        tag,
    },
    {
      headers: {
        Authorization: `Bearer ${NOTEHUB_TOKEN}`,
      },
    }
  );

  return response.data;
};

export async function deleteNote( id: string ): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
}