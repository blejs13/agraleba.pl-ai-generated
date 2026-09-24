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

Galeria zawiera teraz 29 unikatowych zdjęć: 14 nowych i 15 wcześniejszych. Dawny dziewiąty slajd (plik `ogrod-02.jpg`, „Nasz obiekt”) jest pełnoszerokim tłem sekcji „Kontakt i dojazd”, z przyciemnieniem 58% i jasnym tekstem. Wysokość tła dopasowuje się do treści. Zdjęcie nr 1 jest przy udogodnieniach. Sekcja ogrodu pokazuje wskazane przez użytkownika zdjęcia `ogrod-09.jpg`, `ceramika-02.jpg` i `ogrod-05.jpg` w pionowych kadrach 2:3; środkowy kadr przesunięty na ceramikę (80% center). Na telefonie zdjęcia są jedno pod drugim. Poprzednie trzy zdjęcia sekcji są w galerii. Test po podmianie przy 390/1440 px: poprawne proporcje, warianty mobilne i desktopowe, brak powtórzeń i poziomego przepełnienia. Pierwotne testy galerii: 320/390/768/1440 px, gest dotykowy w emulacji Chromium, strzałki, Home/End, powiększenie i Escape. Zachowanie na fizycznym telefonie pozostaje do sprawdzenia.

### Nowe fotografie i SEO

- [x] Przenieść 16 nowych zdjęć do `assets/images`, przygotować warianty 1800/900 px i usunąć EXIF z kopii internetowych.
- [x] Zachować oryginały poza repozytorium: `/Users/macbook/Projects/agraleba-original-photos-J0qW37` (kopie porównane bajt po bajcie; przeniesiony folder importu w `import-folder`).
- [x] Sprawdzić 31 zdjęć ogrodu i galerii przy 390/1440 px: poprawne warianty mobile/desktop, bez powtórzeń, błędów JavaScript i poziomego przepełnienia.
- [x] Dodać favicon ICO/PNG, ikonę Apple i grafikę udostępniania 1200 x 630.
- [x] Dodać statyczne metadane, canonical, Open Graph, Twitter Card, JSON-LD obiektu, robots.txt i sitemap.xml.
- [ ] Po zatwierdzonym wdrożeniu sprawdzić przekierowania domeny i dawnych adresów, odpowiedzi HTTP, Search Console i podglądy udostępniania.

## Weryfikacja lokalna

### Odstępy i typografia

- [x] Ujednolicić pionowe odstępy sekcji: 80 px desktop, 64 px tablet, 48 px telefon; zachować mniejszy odstęp wprowadzenia pod hero.
- [x] Zmniejszyć główne nagłówki do 48/40/34 px (32 px na najmniejszych ekranach), uporządkować odstępy pod nagłówkami i przy opiniach.
- [x] Powiększyć podpisy zdjęć na telefonie do 13 px i tekst przycisków; zachować minimum 44 px wysokości kontrolek.
- [x] Usunąć przycinanie rachunku na tablecie: jedna kolumna do 1000 px, pole 16 px, przenoszenie przycisku kopiowania do nowego wiersza na najwęższych ekranach.
- [x] Ustabilizować mobilny układ podpisu galerii i kontrolek.

Pomiary przy 320/390/701/768/1000/1024/1440/1920 px: brak poziomego przepełnienia, cały rachunek mieści się w polu. Kontrola przy 320/390/768/1024/1440 px: brak nakładania elementów nagłówka strony, przycisków cennika, galerii i udogodnień. Menu mobilne i przejście do drugiego slajdu działają. Edytor nie zgłasza błędów CSS. Zrzuty wbudowanego podglądu mają niestabilny rozmiar, więc pełna ocena wizualna w zwykłej przeglądarce i na fizycznym telefonie pozostaje do wykonania.

### Pozostałe testy

- Opinie Booking.com: pięć cytatów i oceny 10/10, 10/10, 9/10, 8/10, 8/10; podsumowanie 8,3/10 i 54 opinie. Dane przekazane 2026-09-24 przez użytkownika, bez niezależnej weryfikacji serwisu. Sekcja i link menu widoczne; przełączanie działa; brak poziomego przepełnienia przy 320/390/1024/1440 px.
- Układ bez poziomego przewijania przy 320, 390, 768 i 1440 px; telefon widoczny obok menu mobilnego.
- Rotacja opinii, pauza, brak kolejnych powtórzeń i stabilna wysokość przetestowane na danych tylko w pamięci przeglądarki. Pusta lista ukrywa moduł; pojedynczy wpis nie ma kontrolek; niepoprawne oceny są pomijane.
- Sprawdzone wyłączanie nowych modułów, ograniczone animacje, menu i wczytywanie zdjęć ogrodu.
- Kopiowanie rachunku i awaryjne zaznaczenie tekstu przetestowane z kontrolowanym API schowka; uprawnienia rzeczywistego schowka zależą od przeglądarki.
- Sprawdzone adresy Booking.com i trasy. Mapa Google jest teraz tworzona automatycznie bez przycisku, zgodnie z prośbą użytkownika; zoom 10, środek 54.735, 17.50 dla widoku Łeby z jeziorami. Test przy 390/1440 px: ramka powstaje bez interakcji, poprawne parametry, brak błędów JavaScript i poziomego przepełnienia. Pod mapą pozostaje informacja o przekazaniu adresu IP do Google; wymagania prywatności należy ocenić przed publikacją.