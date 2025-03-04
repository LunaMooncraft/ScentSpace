export async function getSupabase(
  table: string,
  filters: Record<string, string | number | boolean | null>,
  single: boolean = false
) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const queryString: string = Object.entries(filters)
    .map(([key, value]): string => `${key}=eq.${value}`)
    .join("&");

  const url: string = `${SUPABASE_URL}/rest/v1/${table}?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return single ? data[0] : data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function updateSupabase(
  table: string,
  filters: Record<string, string | number | boolean | null>,
  updates: Record<string, string | number | boolean | null>
) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const queryString: string = Object.entries(filters)
    .map(([key, value]): string => `${key}=eq.${value}`)
    .join("&");

  const url: string = `${SUPABASE_URL}/rest/v1/${table}?${queryString}`;

  try {
    const response: Response = await fetch(url, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  }
}
