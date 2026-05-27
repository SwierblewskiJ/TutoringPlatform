# Kredkorepetycje - Platforma Korepetycyjna
Platforma łącząca uczniów i korepetytorów. System umożliwia przeglądanie ofert, zarządzanie grafikiem dostępności oraz rezerwację terminów zajęć. Komunikacja z API jest zabezpieczona autoryzacją opartą na tokenach JWT.

---

## Główne funkcjonalności

* **Zarządzanie użytkownikami:** Rejestracja i logowanie z podziałem na role (`Student` oraz `Tutor`).
* **Tablica ogłoszeń:** Tworzenie, edycja, usuwanie i przeglądanie ofert korepetycji.
* **Kalendarz dostępności:** Korepetytorzy mogą definiować ramy czasowe swojej dostępności (bloki zajęciowe trwające od 45 minut do 3 godzin).
* **System rezerwacji:** Uczniowie rezerwują konkretne terminy na podstawie dostępności nauczyciela (wymagane min. 1-dniowe wyprzedzenie). System zapobiega konfliktom i podwójnym rezerwacjom.
* **Statusy zajęć:** Śledzenie i zmiana statusów lekcji (Oczekująca, Potwierdzona, Zakończona, Odwołana) zależnie od posiadanych uprawnień.

---

## Instrukcja uruchomienia

### 1. Baza danych (wymagany Docker)
```bash
docker compose up -d
```

### 2. Konfiguracja Backendu (wymagany .NET 10 SDK)
Serwer wykorzystuje Entity Framework Core. Przy uruchomieniu na pustej bazie danych aplikacja automatycznie wykona migracje oraz uruchomi `DatabaseSeeder`, który wypełni bazę przykładowymi danymi testowymi (użytkownicy, ogłoszenia, okienka czasowe).
```bash
cd backend/TutoringPlatform
dotnet run
```
Aplikacja domyślnie uruchomi się pod adresem: `http://localhost:5192`.
Dokumentacja API (Swagger) jest dostępna pod: `http://localhost:5192/swagger`.

*Aby zresetować bazę i załadować dane testowe ponownie wykonaj:*
```bash
dotnet ef database drop
dotnet ef database update
```

### 3. Konfiguracja Frontendu (wymagany Node.js)
```bash
cd frontend/TutoringPlatformFeReact
npm install
npm run dev
```
Aplikacja domyślnie uruchomi się pod adresem: `http://localhost:5173`.

---

## Autoryzacja i uprawnienia

Większość operacji modyfikujących dane (metody POST, PUT, PATCH, DELETE) wymaga uwierzytelnienia. W nagłówku żądania HTTP należy przekazać token JWT:
`Authorization: Bearer {token}`

System weryfikuje uprawnienia na poziomie logiki biznesowej:
* **Rola: Tutor:** Posiada uprawnienia do tworzenia i edycji wyłącznie własnych ogłoszeń, zarządzania własnym grafikiem oraz zmiany statusu przypisanych do niego lekcji.
* **Rola: Student:** Posiada uprawnienia do rezerwacji terminów oraz anulowania wyłącznie własnych zajęć.