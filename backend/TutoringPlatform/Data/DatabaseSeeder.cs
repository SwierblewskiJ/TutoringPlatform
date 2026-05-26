using Microsoft.EntityFrameworkCore;
using TutoringPlatform.Models;
using TutoringPlatform.Services;

namespace TutoringPlatform.Data;

public class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
        {
            return;
        }

        var testUsers = new List<User>
        {
            new User
            {
                Email = "will@gmail.com",
                Name = "Will Smith",
                Password = passwordHasher.Hash("12345678"),
                Role = UserRole.Student
            },
            new User
            {
                Email = "JohnPork@gmail.com",
                Name = "John Pork",
                Password = passwordHasher.Hash("ZAQ!2wsx"),
                Role = UserRole.Student
            },
            new User
            {
                Email = "edekZgredek@wp.pl",
                Name = "Edzio",
                Password = passwordHasher.Hash("nONWID#(*7gg7f"),
                Role = UserRole.Student
            },
            new User
            {
                Email = "chandler@gmail.com",
                Name = "Chandler Bing",
                Password = passwordHasher.Hash("transponster123"),
                Role = UserRole.Student
            },
            new User
            {
                Email = "joey@gmail.com",
                Name = "Joey Tribbiani",
                Password = passwordHasher.Hash("pizzaLover99"),
                Role = UserRole.Student
            },

            new User
            {
                Email = "Carlito@gmail.com",
                Name = "Carl Johnson",
                Password = passwordHasher.Hash("99v3bvb8"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Matematyka - Matura rozszerzona",
                        Description =
                            "Przygotowanie do matury z matematyki na poziomie rozszerzonym to proces wymagający czasu, cierpliwości i odpowiedniej strategii. " +
                            "Moje zajęcia to kompleksowy program nauczania, który krok po kroku przeprowadzi Cię przez wszystkie działy wymagane na egzaminie dojrzałości. " +
                            "Zapewniam indywidualne podejście do każdego ucznia, pomagając przełamać strach przed matematyką i wypracować pewność siebie niezbędną do osiągnięcia wyniku powyżej 80%.",
                        Price = 80,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(17, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(18, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Fizyka dla studentów",
                        Description = "Mechanika klasyczna i elektrodynamika dla kierunków inżynierskich. " +
                                      "Skupiamy się na rozwiązywaniu złożonych układów równań i praktycznym zastosowaniu praw fizyki.",
                        Price = 100,
                        IsOnline = false,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(16, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Thursday, StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(16, 0, 0) }
                        }
                    }
                }
            },

            new User
            {
                Email = "Paker@op.pl",
                Name = "Paty Kerry",
                Password = passwordHasher.Hash("12345678"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Angielski - konwersacje",
                        Description = "Przełam barierę językową z native speakerem. " +
                                      "Rozmowy na tematy codzienne, podróżnicze i kulturowe z korektą wymowy i akcentu na bieżąco.",
                        Price = 70,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Angielski Business",
                        Description = "Słownictwo biznesowe i techniczne. " +
                                      "Uczymy się pisania formalnych maili, przygotowywania prezentacji oraz prowadzenia negocjacji w międzynarodowym środowisku.",
                        Price = 120,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Thursday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(20, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(20, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "monica@gmail.com",
                Name = "Monica Geller",
                Password = passwordHasher.Hash("cleanfreak1"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Gotowanie i organizacja",
                        Description =
                            "Profesjonalne warsztaty kulinarno-organizacyjne skierowane do osób, które chcą zrewolucjonizować swoje codzienne gotowanie i zarządzanie domową kuchnią. " +
                            "Gotowanie to nie tylko sztuka łączenia smaków, ale przede wszystkim doskonała organizacja czasu.",
                        Price = 150,
                        IsOnline = false,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Saturday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(13, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Sunday, StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(17, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Chemia - szkoła średnia",
                        Description = "Powtórki do sprawdzianów i matury podstawowej. " +
                                      "Przerabiamy stechiometrię, kwasy, zasady oraz podstawy chemii organicznej.",
                        Price = 60,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(16, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(16, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "ross@gmail.com",
                Name = "Ross Geller",
                Password = passwordHasher.Hash("dinosaursRock"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Paleontologia dla pasjonatów",
                        Description =
                            "Wykłady o dinozaurach i ewolucji to pasjonująca podróż w czasie o setki milionów lat wstecz, aż do epoki, kiedy na naszej planecie niepodzielnie królowały gigantyczne gady.",
                        Price = 90,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(20, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(20, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Biologia - poziom maturalny",
                        Description = "Zrozumienie procesów komórkowych i genetyki. " +
                                      "Solidne przygotowanie do nowej matury z biologii z użyciem autorskich arkuszy.",
                        Price = 75,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(18, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Thursday, StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(18, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "rachel@gmail.com",
                Name = "Rachel Green",
                Password = passwordHasher.Hash("fashionIcon2026"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Marketing i Moda",
                        Description = "Podstawy marketingu w branży fashion. " +
                                      "Jak budować markę osobistą, analizować trendy sezonowe i docierać do grupy docelowej.",
                        Price = 110,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(14, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Thursday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(14, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Język francuski od zera",
                        Description = "Podstawowe zwroty i gramatyka dla początkujących. " +
                                      "Skupiamy się na praktycznej komunikacji i poprawnej paryskiej wymowie.",
                        Price = 65,
                        IsOnline = true,
                        IsAvailable = true,
                        TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "walter@white.com",
                Name = "Walter White",
                Password = passwordHasher.Hash("heisenberg1"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Chemia organiczna - poziom zaawansowany",
                        Description = "Dogłębne zrozumienie reakcji chemicznych, krystalografii i termodynamiki. Gwarantuję czystość wiedzy na poziomie 99.1%. Tylko dla zaangażowanych studentów.",
                        Price = 200, IsOnline = false, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(19, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Thursday, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(19, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Przedsiębiorczość i prowadzenie biznesu",
                        Description = "Jak zbudować imperium od zera? Uczę strategii rynkowych, zarządzania ryzykiem, negocjacji z trudnymi partnerami oraz optymalizacji łańcucha dostaw.",
                        Price = 300, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(20, 0, 0), EndTime = new TimeSpan(22, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Zarządzanie kryzysowe",
                        Description = "Praktyczne warsztaty z rozwiązywania problemów pod presją czasu i ukrywania... błędów finansowych w budżecie firmy.",
                        Price = 150, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Saturday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(14, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "ted@mosby.com",
                Name = "Ted Mosby",
                Password = passwordHasher.Hash("architecture123"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Architektura i projektowanie przestrzeni",
                        Description = "Od szkiców po realizację. Poznaj zasady projektowania pięknych i funkcjonalnych budynków. Zrozum, dlaczego Empire State Building to arcydzieło.",
                        Price = 110, IsOnline = false, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(18, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(18, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Historia architektury",
                        Description = "Fascynująca podróż przez epoki, style i konstrukcje. Dowiedz się, jak gotyk różni się od renesansu i dlaczego detale mają znaczenie.",
                        Price = 85, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(20, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Rysunek techniczny i kaligrafia",
                        Description = "Naucz się perfekcyjnego kreślenia linii, planów pięter oraz pięknej, rzemieślniczej kaligrafii, którą zaimponujesz na każdych zajęciach na politechnice.",
                        Price = 75, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(16, 0, 0) }
                        }
                    }
                }
            },
            new User
            {
                Email = "sheldon@cooper.com",
                Name = "Sheldon Cooper",
                Password = passwordHasher.Hash("bazinga321"),
                Role = UserRole.Tutor,
                TutoringAds = new List<TutoringAd>
                {
                    new TutoringAd
                    {
                        Title = "Fizyka teoretyczna i teoria strun",
                        Description = "Zajęcia tylko dla jednostek o wybitnym intelekcie (czyli IQ powyżej 140). Będziemy badać asymetrię materii we wszechświecie. Proszę nie zadawać głupich pytań.",
                        Price = 250, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Monday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Wednesday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0) },
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Friday, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Analiza matematyczna (Poziom doktorancki)",
                        Description = "Od całek wielokrotnych po równania różniczkowe cząstkowe. Rozwiązujemy problemy milenijne. Wymagany własny zapas markerów do tablicy.",
                        Price = 180, IsOnline = false, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Tuesday, StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(16, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Kolejnictwo - Historia i budowa pociągów",
                        Description = "Moja największa pasja. Zgłębimy tajniki lokomotyw parowych, spalinowych i elektrycznych. Zbudujemy makiety w skali H0.",
                        Price = 50, IsOnline = true, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Saturday, StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(18, 0, 0) }
                        }
                    },
                    new TutoringAd
                    {
                        Title = "Gra w szachy w 3D",
                        Description = "Standardowe szachy są zbyt proste dla trójwymiarowego umysłu. Uczę strategii poruszania się na wielu płaszczyznach w oparciu o zasady ze Star Treka.",
                        Price = 90, IsOnline = false, IsAvailable = true, TutorId = 0,
                        TutorAvailabilities = new List<TutorAvailability>
                        {
                            new TutorAvailability { TutoringAdId = 0, DayOfWeek = DayOfWeek.Sunday, StartTime = new TimeSpan(18, 0, 0), EndTime = new TimeSpan(19, 0, 0) }
                        }
                    }
                }
            }
        };

        await context.Users.AddRangeAsync(testUsers);
        await context.SaveChangesAsync();
    }
}