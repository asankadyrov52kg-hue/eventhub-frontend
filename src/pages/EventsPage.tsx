import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

interface BackendCategory {
  id: string;
  name: string;
}

interface BackendEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  price: number;
  capacity: number;
  image?: string;
  categoryId: string;
}

export default function EventsPage() {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все категории");
  const [sort, setSort] = useState<"nearest" | "cheap" | "expensive">("nearest");

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError("");

        const [eventsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/events"),
          fetch("http://localhost:3000/categories")
        ]);

        if (!eventsRes.ok || !categoriesRes.ok) {
          throw new Error("Не удалось загрузить данные с сервера");
        }

        const eventsData: BackendEvent[] = await eventsRes.json();
        const categoriesData: BackendCategory[] = await categoriesRes.json();

        const formattedEvents = (Array.isArray(eventsData) ? eventsData : []).map((e) => {
          const cat = categoriesData.find((c) => c.id === e.categoryId);
          return {
            ...e,
            category: cat ? cat.name : "Другое",
            location: e.address,
            seatsLeft: e.capacity,
            imageUrl: e.image ? e.image : "https://placehold.co",
          };
        });

        setEvents(formattedEvents);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err: any) {
        setError(err.message || "Ошибка соединения с сервером");
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  const filteredAndSortedEvents = useMemo(() => {
    let result = events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory !== "Все категории") {
      result = result.filter((e) => e.categoryId === selectedCategory);
    }

    if (sort === "nearest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "cheap") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "expensive") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [events, search, selectedCategory, sort]);

  const handleDetails = (id: string) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Афиша мероприятий
      </h1>
      <p className="text-gray-500 mb-6">
        Открывайте интересные события рядом с вами
      </p>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Поиск мероприятий по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          disabled={loading}
        >
          <option value="Все категории">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          disabled={loading}
        >
          <option value="nearest">Сначала ближайшие</option>
          <option value="cheap">Сначала дешевле</option>
          <option value="expensive">Сначала дороже</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Ближайшие мероприятия
        </h2>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-12">Загрузка актуальной афиши…</p>
      )}

      {!loading && error && (
        <p className="text-center text-red-500 py-6">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAndSortedEvents.map((event) => (
            <EventCard key={event.id} event={event} onDetails={handleDetails} />
          ))}
        </div>
      )}

      {!loading && !error && filteredAndSortedEvents.length === 0 && (
        <p className="text-center text-gray-400 mt-10">Ничего не найдено</p>
      )}
    </div>
  );
}
