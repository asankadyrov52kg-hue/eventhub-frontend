import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = 3000;
const CURRENT_USER_ID = "user-1";

const category = (id, name) => ({ id, name });

let events = [
  {
    id: "c9ac8142-36bf-4d6c-b030-0fe25f7506ce",
    title: "Летний джаз в Саду «Эрмитаж»",
    description: "Живой джаз под открытым небом",
    date: "2026-10-25T18:00:00.000Z",
    address: "г. Бишкек, ул. Чуй 123",
    price: 1200,
    capacity: 48,
    image: null,
    userId: CURRENT_USER_ID,
    categoryId: "9a2494c4-2392-49de-893b-f46ed410e0b1",
    category: category("9a2494c4-2392-49de-893b-f46ed410e0b1", "Концерт"),
  },
  {
    id: randomUUID(),
    title: "Как развивать креативное мышление",
    description: "Лекция о творческом мышлении",
    date: "2026-11-02T10:00:00.000Z",
    address: "г. Бишкек, ул. Токтогула 45",
    price: 500,
    capacity: 23,
    image: null,
    userId: CURRENT_USER_ID,
    categoryId: "2f6ad5b4-1e07-4d0d-9c5e-6d0f5f8b8a11",
    category: category("2f6ad5b4-1e07-4d0d-9c5e-6d0f5f8b8a11", "Лекция"),
  },
  {
    id: randomUUID(),
    title: "Зеленый забег 5 км",
    description: "Забег в парке для всех желающих",
    date: "2026-11-08T07:00:00.000Z",
    address: "г. Бишкек, парк Ататюрк",
    price: 0,
    capacity: 120,
    image: null,
    userId: "another-user",
    categoryId: "7c3d1d0a-5b9e-4a86-8a3f-0b6f4a2c9e21",
    category: category("7c3d1d0a-5b9e-4a86-8a3f-0b6f4a2c9e21", "Спорт"),
  },
];

let registrations = [
  { id: randomUUID(), userId: CURRENT_USER_ID, eventId: events[2].id },
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", ...corsHeaders });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const withEvent = (r) => ({ ...r, event: events.find((e) => e.id === r.eventId) });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http:localhost:${PORT}`);
  const { pathname } = url;
  console.log(`${req.method} ${pathname}${url.search}`);

  if (req.method === "OPTIONS") return send(res, 204);
  if (req.method === "GET" && pathname === "/") return send(res, 200, "Hello World!");
  if (pathname === "/events") {
    if (req.method === "GET") return send(res, 200, events);

    if (req.method === "POST") {
      const body = await readBody(req);
      const created = {
        id: randomUUID(),
        userId: CURRENT_USER_ID,
        image: null,
        ...body,
      };
      events.push(created);
      return send(res, 201, created);
    }
  }

  const eventMatch = pathname.match(/^\/events\/([^/]+)$/);
  if (eventMatch) {
    const id = eventMatch[1];
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return send(res, 404, { message: "Мероприятие не найдено" });

    if (req.method === "GET") return send(res, 200, events[index]);

    if (req.method === "PATCH") {
      const body = await readBody(req);
      events[index] = { ...events[index], ...body };
      return send(res, 200, events[index]);
    }

    if (req.method === "DELETE") {
      events = events.filter((e) => e.id !== id);
      registrations = registrations.filter((r) => r.eventId !== id);
      return send(res, 200, { message: "Мероприятие удалено" });
    }
  }

  if (pathname === "/registrations" && req.method === "POST") {
    const { eventId } = await readBody(req);
    if (!events.some((e) => e.id === eventId)) {
      return send(res, 400, { message: "Мероприятие не найдено" });
    }
    const registration = { id: randomUUID(), userId: CURRENT_USER_ID, eventId };
    registrations.push(registration);
    return send(res, 201, registration);
  }

  if (pathname === "/registrations/my" && req.method === "GET") {
    return send(
      res,
      200,
      registrations.filter((r) => r.userId === CURRENT_USER_ID).map(withEvent),
    );
  }

  if (pathname === "/registrations/check" && req.method === "GET") {
    const eventId = url.searchParams.get("eventId");
    const isRegistered = registrations.some(
      (r) => r.userId === CURRENT_USER_ID && r.eventId === eventId,
    );
    return send(res, 200, { isRegistered });
  }

  send(res, 404, { message: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Тестовый сервер запущен: http:localhost:${PORT}/events`);
});
