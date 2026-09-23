# Aktualizacja strony

- [x] Usunąć numery sekcji; dodać klikalny telefon obok menu mobilnego.
- [x] Naprawić wyznaczanie trasy i dodać mapę na dole strony.
- [x] Dodać dane przelewu ze starej strony oraz kopiowanie numeru konta.
- [x] Uzupełnić stronę zdjęciami obiektu i animacją pojawiania się sekcji.
- [x] Dodać losowe opinie z konfiguracji: tekst, gwiazdki, źródło; automatyczna rotacja z pauzą.
- [x] Sprawdzić desktop, telefon, przełączniki modułów i ograniczenie animacji.
- [x] Dodać link Booking.com obok telefonu w cenniku.
- [x] Dodać pięć opinii przekazanych przez użytkownika z ocenami Booking.com w skali /10.
- [x] Pokazać ocenę Booking.com 8,3/10 z 54 opinii, aktualizowaną ręcznie w konfiguracji.
- [x] Dodać opis pracowni ceramicznej właścicielki i ceramicznych dekoracji ścian oraz ogrodu.
- [ ] Potwierdzić aktualność rachunku.

Zmiany dotyczą wersji lokalnej, bez wdrożenia i bez commita.

## Udogodnienia i galeria

- [x] Zastąpić dwie karty pokojów jednym zdjęciem po lewej i listą udogodnień po prawej.
- [x] Zebrać w galerii pozostałe zdjęcia, bez powtarzania ujęć z innych sekcji.
- [x] Pokazywać jedno zdjęcie naraz, z przewijaniem palcem i strzałkami oraz powiększeniem.
- [x] Użyć lazy loading i dostępnych wariantów desktop/mobile.
- [x] Sprawdzić przewijanie, klawiaturę, zdjęcia i układ na telefonie oraz desktopie.

Galeria zawiera teraz 15 unikatowych zdjęć. Dawny dziewiąty slajd (plik `(12).jpg`, „Nasz obiekt”) jest pełnoszerokim tłem sekcji „Kontakt i dojazd”, z przyciemnieniem 58% i jasnym tekstem. Wysokość tła dopasowuje się do treści. Zdjęcie nr 1 jest przy udogodnieniach, a 19, 20 i 22 w sekcji ogrodu. Kopie dawnych plików z katalogu `assets/images` nie są ponownie dodawane. Pierwotne testy galerii: 320/390/768/1440 px, 16/16 zdjęć desktop i mobile, gest dotykowy w emulacji Chromium, strzałki, Home/End, powiększenie i Escape. Po zmianie kontaktu: poprawne warianty zdjęcia i pełne pokrycie sekcji przy 390/1440 px, brak poziomego przepełnienia, przycisk trasy nad tłem. Zachowanie na fizycznym telefonie pozostaje do sprawdzenia.

## Weryfikacja lokalna

- Opinie Booking.com: pięć cytatów i oceny 10/10, 10/10, 9/10, 8/10, 8/10; podsumowanie 8,3/10 i 54 opinie. Dane przekazane 2026-09-24 przez użytkownika, bez niezależnej weryfikacji serwisu. Sekcja i link menu widoczne; przełączanie działa; brak poziomego przepełnienia przy 320/390/1024/1440 px.
- Układ bez poziomego przewijania przy 320, 390, 768 i 1440 px; telefon widoczny obok menu mobilnego.
- Rotacja opinii, pauza, brak kolejnych powtórzeń i stabilna wysokość przetestowane na danych tylko w pamięci przeglądarki. Pusta lista ukrywa moduł; pojedynczy wpis nie ma kontrolek; niepoprawne oceny są pomijane.
- Sprawdzone wyłączanie nowych modułów, ograniczone animacje, menu i wczytywanie zdjęć ogrodu.
- Kopiowanie rachunku i awaryjne zaznaczenie tekstu przetestowane z kontrolowanym API schowka; uprawnienia rzeczywistego schowka zależą od przeglądarki.
- Sprawdzone adresy Booking.com i trasy oraz utworzenie ramki Google Maps dopiero po kliknięciu. Dostępność zewnętrznych usług nie była potwierdzana.