import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { toast } from "react-hot-toast";
import css from "../NoteList/NoteList.module.css";

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

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

    if (notes.length === 0) {
        return null;
    }
    
    return (
    <ul className={css.list}>
        {notes.map(note => (
            <li className={css.listItem} key={note.id}>
                <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
                    <span className={css.tag}>{note.tag}</span>
                    <button className={css.button} onClick={() => handleDelete(note.id)} disabled={deleteNoteMutation.isPending} >Delete</button>
            </div>
            </li>
            ))}
    </ul>
    );
  }