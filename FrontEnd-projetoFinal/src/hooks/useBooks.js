import { useEffect, useState } from "react";
import { listBooks } from "../api";

export function useListBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const data = await listBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { books, loading, error, reload: load };
}
