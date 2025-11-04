import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface MoveRequest {
  id: string;
  pickup: string;
  dropoff: string;
  phone: string;
  move_datetime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RawMoveRequest {
  id: string;
  pickup: string;
  dropoff: string;
  phone: string;
  move_datetime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchReturn {
  requests: MoveRequest[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function useFetchRequest(token: string | null): FetchReturn {
  const [requests, setRequests] = useState<MoveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const fetchRequests = useCallback(async () => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!refreshing) setLoading(true);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/get-requests`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to fetch requests");

      const formatted: MoveRequest[] = data.requests.map(
        (req: RawMoveRequest) => ({
          ...req,
          move_datetime: formatDate(req.move_datetime),
        })
      );

      setRequests(formatted);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, refreshing]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, refreshing, error, onRefresh };
}
