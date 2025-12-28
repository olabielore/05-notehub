import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { CreateNoteProps } from "../../services/noteService.ts";

import Pagination  from "../Pagination/Pagination.tsx";
import NoteList from "../NoteList/NoteList.tsx";
import Modal from "../Modal/Modal.tsx";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";


import css from "./App.module.css";


export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const [debouncedSearch] = useDebounce(search, 1000);
    const perPage = 12;
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch, }),
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.totalPages ?? 0;
    const notes = data?.notes ?? [];

    const deleteNoteMutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note deleted");
        },
    });

    const handleDelete = (id: string) => {
        deleteNoteMutation.mutate(id);
    };

    const createNoteMutation = useMutation({
        mutationFn: (data: CreateNoteProps) => createNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            setIsModalOpen(false);
        }
    });

    const handleCreateNote = (data: CreateNoteProps) => {
        createNoteMutation.mutate(data);
    }

    const handlePageChange = (page: number) => {
        setPage(page);
    };
    
    if (isError) {
        return <p>Something went wrong!</p>;
    }
    
    return (

        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={setSearch} />
                {totalPages > 1 && ( 
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} /> 
                )}
                <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
            </header>

            {!isLoading && notes.length > 0 && (
                <NoteList notes={notes} onDelete={handleDelete} />
            )}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={handleCreateNote}
                    />
                </Modal>
        </div>
    );
}