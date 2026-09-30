import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { type EventCategory } from "../types/event";
import EventCard from "../components/EventCard";

const categories: EventCategory[] = [
  "Концерт",
  "Лекция", 
  "Выставка",
  "Спорт",
  "Мастер-класс",
  "Кино",
  "Нетворкинг",
  "Фестиваль",
];

export default function EventsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Все категории");
  const [sort, setSort] = useState<"nearest" | "cheap" | "expensive">(
    "nearest",
  );

  const filteredEvents = useMemo(() => {
    let result = mockEvents.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
    if (category !== "Все категории") {
      result = result.filter((e) => e.category === category);
    }
    return result;
  }, [search, category, sort]);

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
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
        >
          <option>Все категории</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Показать все
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} onDetails={handleDetails} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-400 mt-10">Ничего не найдено</p>
      )}
    </div>
  );
}