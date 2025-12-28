import css from "../NoteForm/NoteForm.module.css";
import { Form, Field, Formik, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from 'react';
import { createNote } from "../../services/noteService";
import type { CreateNoteProps } from "../../services/noteService";

interface NoteFormValues {
    title: string;
    content: string;
    tag: string;
}

const noteFormValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
};
  
interface NoteFormProps {
    onCancel: () => void;
    onSubmit: (data: CreateNoteProps) => void;
}

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title is too long")
        .required("Title is required"),
    content: Yup.string()
        .max(500, "Content is too long"),
    tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
        .required('Tag is required'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {

    const fieldId = useId();

    const handleSubmit = async (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
        try {
            await createNote(values);
            actions.resetForm();
            onCancel();
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Formik initialValues={noteFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor={`${fieldId}-title`}>Title</label>
                        <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                        <ErrorMessage name="title" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${fieldId}-content`} >Content</label>
                        <Field
                            as="textarea"
                            id={`${fieldId}-content`}
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage name="content" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${fieldId}-tag`}>Tag</label>
                        <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage name="tag" component="span" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton} onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className={css.submitButton}
                        >
                            {isSubmitting ? 'Loading ...' : 'Create note'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}