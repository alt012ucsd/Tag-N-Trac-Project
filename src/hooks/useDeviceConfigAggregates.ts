import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface Result {
  event_type: string;
  count: number;
}

export function useDeviceConfigAggregates(filters: {
  org?: string;
  project?: string;
}) {
  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let query = supabase
        .from("device_configs")
        .select("event_type, count:count(*)");
      // .group("event_type"); // Removed: Supabase does not support .group()

      if (filters.org) query = query.eq("organization", filters.org);
      if (filters.project) query = query.eq("project_name", filters.project);

      const { data, error } = await query;
      if (!error && data) {
        setData(data as Result[]);
      }
      setLoading(false);
    }
    fetchData();
  }, [filters]);

  return { data, loading };
}
