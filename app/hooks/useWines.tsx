import { useState, useEffect, useCallback, useContext } from "react";
import { getWinesFromStorage } from "../services/storage";
import { AuthContext } from "../contexts/AuthContext";
import { Wine } from "../../types";

export const useWines = (filterType: string | null) => {
  const { currentUser } = useContext(AuthContext);
  const [wines, setWines] = useState<Wine[]>([]);

  const fetchWines = useCallback(async () => {
    if (!currentUser?.id) {
      setWines([]);
      return;
    }
    try {
      const localWines: Wine[] = await getWinesFromStorage();
      const filtered: Wine[] = localWines.filter(
        (w: Wine) =>
          w.userId === currentUser.id &&
          (filterType ? w.type === filterType : true)
      );
      setWines(filtered);
    } catch (error) {
      console.error("Error loading wines:", error);
      setWines([]);
    }
  }, [filterType, currentUser]);

  useEffect(() => {
    fetchWines();
  }, [fetchWines]);

  return { wines, refetch: fetchWines };
};
