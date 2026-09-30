export type EventCategory =
  | "Концерт"
  | "Лекция"
  | "Выставка"
  | "Спорт"
  | "Мастер-класс"
  | "Кино"
  | "Нетворкинг"
  | "Фестиваль";

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  location: string;
  price: string;
  seatsLeft: number;
  imageUrl: string;
}