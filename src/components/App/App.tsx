import { useState } from "react";
import { useQuery, keepPreviousData} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "../../services/noteService";

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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch, }),
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.totalPages ?? 0;
    const notes = data?.notes ?? [];

    const handlePageChange = (page: number) => {
        setPage(page);
    };
    
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    if (isError) {
        return <p>Something went wrong!</p>;
    }
    
    return (

        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={handleSearchChange} />
                {totalPages > 1 && ( 
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} /> 
                )}
                <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
            </header>

            {!isLoading && notes.length > 0 && (
                <NoteList notes={notes}/>
            )}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}>
                    <NoteForm setIsModalOpen={setIsModalOpen} />
                </Modal>
        </div>
    );
}