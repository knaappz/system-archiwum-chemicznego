// src/data/knowledgeData.js
export const knowledgeData = [
    {
        id: 'rodzaje-substancji',
        title: '1. Rodzaje substancji chemicznych',
        examples: 'Przykładowo: Kwasy (siarkowy, solny, azotowy), wodorotlenek sodu, sole (chlorek sodu), rozpuszczalniki organiczne, polimery, nawozy itd.',
        groups: [
            {
                name: 'Surowce podstawowe',
                properties: [
                    'Proste, często nieorganiczne związki — wysoka reaktywność (kwasy/zasady), gazowe lub wodne roztwory.',
                    'Silne właściwości utleniające lub redukujące (np. stężone kwasy, czyste gazy).',
                    'Hydrofilność (sole, zasady) lub polarność (kwasy nieorganiczne).',
                    'Stabilność temperaturowa zależna od stopnia czystości i warunków (gazy sprężone, substancje higroskopijne).'
                ],
                hazards: [
                    'Żrące działanie — stężone kwasy i zasady powodują poparzenia chemiczne.',
                    'Korozja instalacji i opakowań.',
                    'Toksyczność przy wdychaniu oparów.',
                    'Zagrożenia środowiskowe — zakwaszenie gleby, eutrofizacja.'
                ]
            },
            {
                name: 'Surowce organiczne',
                properties: [
                    'Lotne, łatwopalne, często o niskiej polarności (węglowodory) lub średniej (alkohole, ketony).',
                    'Wysoki współczynnik parowania i niska temperatura zapłonu u wielu rozpuszczalników.',
                    'Mogą być metabolizowane biologicznie; niektóre są mutagenne/karcynogenne (np. formaldehyd).',
                    'Reaktywność: utlenianie, addycje, estryfikacje zależnie od grupy funkcyjnej.'
                ],
                hazards: [
                    'Łatwopalność i ryzyko pożaru/wybuchu.',
                    'Toksyczność przez inhalację lub spożycie (np. metanol — uszkodzenie wzroku).',
                    'Uszkodzenie wątroby, nerek, układu nerwowego.',
                    'Bioakumulacja i trwałość w środowisku.'
                ]
            },
            {
                name: 'Półprodukty chemiczne',
                properties: [
                    'Związki przejściowe o wyższej reaktywności niż produkty finalne.',
                    'Mogą być niestabilne chemicznie i wymagać specjalnych warunków przechowywania.',
                    'Często toksyczne lub drażniące.'
                ],
                hazards: [
                    'Niestabilność i możliwość gwałtownych reakcji.',
                    'Toksyczność i drażniące działanie na skórę i drogi oddechowe.'
                ]
            },
            {
                name: 'Produkty gotowe',
                properties: [
                    'Polimery, żywice, barwniki, kosmetyki.',
                    'Właściwości zależne od zastosowania — często stabilne, ale mogą degradować pod wpływem UV lub temperatury.'
                ],
                hazards: [
                    'Część może wydzielać szkodliwe opary przy spalaniu lub obróbce.',
                    'Zanieczyszczenia produkcyjne mogą być niebezpieczne.'
                ]
            },
            {
                name: 'Substancje specjalistyczne',
                properties: [
                    'Wysokoczyste odczynniki do analiz, katalizatory, środki ochrony roślin.',
                    'Często bardzo reaktywne lub toksyczne w małych dawkach.'
                ],
                hazards: [
                    'Bardzo niska dawka toksyczna.',
                    'Reaktywność z powietrzem lub wodą.'
                ]
            },
            {
                name: 'Odpady i produkty uboczne',
                properties: [
                    'Mieszanki o nieznanym składzie.',
                    'Mogą zawierać toksyczne lub niebezpieczne pozostałości reakcji.'
                ],
                hazards: [
                    'Mogą wydzielać toksyczne gazy.',
                    'Trudne w neutralizacji, ryzyko skażenia środowiska.'
                ]
            }
        ]
    },
    {
        id: 'oznaczenia',
        title: '2. Oznaczenia',
        examples: 'Rodzaje oznaczeń na opakowaniach.',
        groups: [
            {
                name: 'Zagrożenia dla zdrowia',
                image: '/assets/guide/oznaczenia.png',
                properties: [

                ],
                hazards: [

                ]
            }
        ]
    },
    {
        id: 'zasady-bhp',
        title: '3. Zasady BHP',
        examples: 'Ogólne i szczegółowe zasady bezpieczeństwa w pracy z chemikaliami.',
        groups: [
            {
                name: 'Ogólne zasady',
                properties: [
                    'Używanie środków ochrony indywidualnej (rękawice, okulary, fartuchy).',
                    'Praca w dobrze wentylowanych pomieszczeniach lub pod wyciągiem.',
                    'Przechowywanie substancji w odpowiednich pojemnikach z etykietami.',
                    'Znajomość kart charakterystyki substancji.'
                ],
                hazards: [
                    'Nieprzestrzeganie zasad może prowadzić do poparzeń, zatruć lub pożarów.',
                    'Brak odpowiedniego sprzętu ochronnego zwiększa ryzyko wypadków.',
                    'Niewłaściwe przechowywanie grozi reakcjami niekontrolowanymi.'
                ]
            }
        ]
    },
    {
        id: 'instrukcje',
        title: '4. Instrukcje',
        examples: 'Szczegółowe kroki pracy w archiwum i procesach technologicznych.',
        groups: [
            {
                name: 'Instrukcja obsługi panelu dodawania',
                image: '/assets/guide/add.png',
                description: 'Na zdjęciu pokazano panel dodawania próbek, który należy uzupełnić danymi z etykiety próbki dostarczonej do archiwum.',
                properties: [
                    '1. Należy wybrać grupe substancji: surowce lub wyroby.',
                    '2. Następnie wpisać nr partii o ile istnieje.',
                    '3. Kolejno nr analizy, nadany wcześniej przez upoważnione osoby.',
                    '4. Okres archiwizacji, zgodny z wytycznymi oraz date archiwizacji (data produkcji spisana z opakowania)',
                    '5. Wielkość próbki w ml',
                    '6. Lokalizacja dobrana do danego typu substancji, zgodna z wytycznymi w /standards.'
                ],
                hazards: []
            },
            {
                name: 'Instrukcja obsługi panelu zleceń',
                image: '/assets/guide/register.png',
                description: 'Panel rejestru zleceń wydania próbki do ponownych badań.',
                properties: [
                    '1. Wpisujemy osobę która zleca wydanie próbki, może być to przełożony, specjalista techniczny itd.',
                    '2. Następnie uzupełniamy do kogo próbka ma trafić, laborant, badacz itd.',
                    '3. Najważniejszy moment, wybieramy próbkę z bazy, szukamy np po partii, nr analizy lub nazwa a nawet id z etykiety o ile taką posiadamy.',
                    '4. W razie potrzeby wpisujemy dodatkowe dane w uwagach.',
                    '5. Po wykonaniu zlecenia, ukaże się ono po prawej stronie.'
                ],
                hazards: []
            },
        ]
    },
    {
        id: 'brak',
        title: '5. ...',
        examples: 'in progress...',
        groups: [
            {
                name: 'nazwa',
                properties: [
                    'Pusty opis...'
                ],
                hazards: [
                    'Pusty opis...'
                ]
            }
        ]
    },
];
