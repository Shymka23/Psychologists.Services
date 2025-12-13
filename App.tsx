import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from './firebase';
import { AuthForms } from './components/AuthForms';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { psychologistsData } from './data';
import { Psychologist, FilterType } from './types';
import { PsychologistCard } from './components/PsychologistCard';
import { AppContext, useAppContext } from './context';
import { Loader2 } from 'lucide-react';
import { SkeletonCard } from './components/SkeletonCard';
import { Icon } from './components/Icon';

const syncFavorites = async (uid: string, newFavorites: string[]) => {
  try {
    await set(ref(db, `users/${uid}/favorites`), newFavorites);
  } catch {
    return;
  }
};

const fetchFavorites = async (uid: string): Promise<string[]> => {
  try {
    const snapshot = await get(child(ref(db), `users/${uid}/favorites`));

    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch {
    return [];
  }

  return [];
};

const fetchPsychologists = async (): Promise<Psychologist[]> => {
  try {
    const snapshot = await get(child(ref(db), 'psychologists'));

    if (snapshot.exists()) {
      const value = snapshot.val() as Record<string, Psychologist>;

      return Object.entries(value).map(([id, data]) => ({
        ...data,
        id,
      }));
    }
  } catch {
    return psychologistsData;
  }

  return psychologistsData;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth).catch(() => {
        // Fallback for demo mode logout (just reload since state is local)
        window.location.reload();
    });
  };

  // Nav link style matching the snippet
  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `relative flex flex-col items-center gap-1 text-base font-normal font-['Inter'] leading-5 transition-colors duration-300 ${
      isActive ? 'text-stone-900' : 'text-stone-900 hover:text-emerald-500'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] bg-zinc-100">
      <header className="bg-white border-b border-stone-900/10 sticky top-0 z-40 transition-shadow duration-300">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[128px] py-4 md:py-6 flex flex-row items-center justify-between gap-2">
          
          <div className="flex flex-row items-center gap-4 xl:gap-32">
              {/* Logo */}
              <Link to="/" className="relative block shrink-0 hover:opacity-80 transition-opacity duration-300">
                <div className="left-0 top-0 justify-start flex items-baseline">
                    <span className="text-emerald-400 text-sm sm:text-lg md:text-xl font-bold leading-6">psychologists</span>
                    <span className="text-emerald-400 text-sm sm:text-lg md:text-xl font-medium leading-6">.</span>
                    <span className="text-stone-900 text-sm sm:text-lg md:text-xl font-semibold leading-6">services</span>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="flex items-start gap-10 h-8 hidden lg:flex">
                <Link to="/" className={navLinkClass('/')}>
                  Home
                  <div className={`w-2 h-2 bg-emerald-400 rounded-full mt-0.5 transition-all duration-300 ${location.pathname === '/' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                </Link>
                <Link to="/psychologists" className={navLinkClass('/psychologists')}>
                  Psychologists
                  <div className={`w-2 h-2 bg-emerald-400 rounded-full mt-0.5 transition-all duration-300 ${location.pathname === '/psychologists' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                </Link>
                {user && (
                  <Link to="/favorites" className={navLinkClass('/favorites')}>
                    Favorites
                    <div className={`w-2 h-2 bg-emerald-400 rounded-full mt-0.5 transition-all duration-300 ${location.pathname === '/favorites' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                  </Link>
                )}
              </nav>
          </div>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4 flex-row animate-fadeIn">
                 <div className="flex items-center gap-2 md:gap-3.5">
                   <div className="w-8 h-8 md:w-10 md:h-10 relative shrink-0">
                      <div className="w-full h-full absolute left-0 top-0 bg-emerald-400 rounded-[10px]" />
                      <div className="w-[60%] h-[60%] absolute left-[20%] top-[20%] overflow-hidden">
                        <div className="w-full h-full bg-neutral-50 text-emerald-400 flex items-center justify-center text-[10px] md:text-xs font-bold rounded-sm">
                           {user.displayName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      </div>
                   </div>
                   <span className="text-stone-900 text-sm md:text-base font-medium leading-5 hidden sm:inline truncate max-w-[100px]">{user.displayName || "User"}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 md:px-10 md:py-3.5 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-900/20 flex justify-center items-center gap-2 overflow-hidden hover:bg-zinc-50 transition-colors"
                >
                    <span className="text-stone-900 text-sm md:text-base font-medium font-['Inter'] leading-5">Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-2">
                 <button 
                    onClick={() => openAuthModal('login')} 
                    className="px-4 py-2.5 md:px-10 md:py-3.5 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-stone-900/20 flex justify-center items-center gap-2 overflow-hidden hover:bg-zinc-50 transition-colors active:scale-95 duration-200"
                 >
                    <div className="justify-start text-stone-900 text-sm md:text-base font-medium font-['Inter'] leading-5">Log In</div>
                 </button>
                 
                 <button 
                    onClick={() => openAuthModal('register')} 
                    className="px-4 py-2.5 md:px-10 md:py-3.5 bg-emerald-400 rounded-[30px] flex justify-center items-center gap-2 overflow-hidden hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-emerald-400/50 active:scale-95 duration-200"
                 >
                    <div className="justify-start text-neutral-50 text-sm md:text-base font-medium font-['Inter'] leading-5">Registration</div>
                 </button>
              </div>
            )}

            {/* Mobile Burger Menu */}
            <button 
                className="lg:hidden p-2 text-stone-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <div className="space-y-1.5">
                    <div className={`w-6 h-0.5 bg-stone-900 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-stone-900 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-stone-900 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-stone-100 absolute w-full left-0 top-full p-4 flex flex-col gap-4 shadow-xl animate-slideUp">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 font-medium py-2 px-4 hover:bg-zinc-50 rounded-lg">Home</Link>
                <Link to="/psychologists" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 font-medium py-2 px-4 hover:bg-zinc-50 rounded-lg">Psychologists</Link>
                {user && (
                    <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 font-medium py-2 px-4 hover:bg-zinc-50 rounded-lg">Favorites</Link>
                )}
            </div>
        )}
      </header>
      <main className="flex-1 w-full relative animate-fadeIn">
        {children}
      </main>
    </div>
  );
};

const HomePage = () => {
    return (
        <section className="relative w-full bg-neutral-50 overflow-hidden min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[128px] relative h-full flex flex-col lg:flex-row py-12 md:py-16 lg:py-[126px] gap-8 lg:gap-10">
                <div className="inline-flex flex-col justify-start items-start gap-8 md:gap-10 relative z-10 lg:mt-10 animate-slideUp">
                  <div className="flex flex-col justify-start items-start gap-5">
                    <div className="w-full md:w-[595px] justify-start">
                        <h1 className="text-stone-900 text-4xl sm:text-5xl md:text-7xl font-semibold font-['Inter'] leading-tight md:leading-[82px]">
                          The road to the{' '}
                          <span className="text-emerald-400 italic">
                            depths
                          </span>{' '}
                          of the human soul
                        </h1>
                    </div>
                    <div className="w-full md:w-[510px] justify-start text-stone-900 text-base sm:text-lg font-medium font-['Inter'] leading-6 opacity-0 animate-slideUp delay-200">
                        We help you to reveal your potential, overcome challenges and find a guide in your own life with the help of our experienced psychologists.
                    </div>
                  </div>
                  
                  <Link to="/psychologists" className="w-full sm:w-auto opacity-0 animate-slideUp delay-300">
                    <button className="w-full sm:w-auto px-8 sm:px-12 py-4 bg-emerald-400 rounded-[30px] inline-flex justify-center items-center gap-4 overflow-hidden hover:bg-emerald-500 transition-all duration-300 group shadow-lg hover:shadow-emerald-400/50 hover:-translate-y-1">
                      <div className="justify-start text-neutral-50 text-xl font-medium font-['Inter'] leading-6">Get started</div>
                      <Icon
                        name="arrow-right"
                        className="w-5 h-5 text-neutral-50 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                        aria-hidden
                      />
                    </button>
                  </Link>
                </div>

                <div className="relative w-full max-w-[464px] h-[320px] sm:h-[360px] md:h-[526px] mx-auto lg:mr-[128px] shrink-0 mt-10 lg:mt-0 opacity-0 animate-fadeIn delay-500">
                     <div className="relative rounded-[10px] overflow-hidden w-full h-full shadow-2xl">
                        <img
                          src="/images/hero/psychologist.jpg"
                          srcSet="/images/hero/psychologist.jpg 1x, /images/hero/psychologist@2x.jpg 2x"
                          sizes="(min-width: 1024px) 464px, 80vw"
                          alt="Psychologist during an online consultation"
                          className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="absolute top-[100px] -right-[200px] w-[469px] h-[469px] bg-emerald-400 rounded-full blur-[500px] -z-10 pointer-events-none animate-pulse-slow"></div>

                     <div className="absolute bottom-[75px] -left-[101px] w-80 h-28 hidden md:block animate-slideUp delay-700">
                        <div className="w-80 h-28 left-0 top-0 absolute bg-emerald-400 rounded-[20px] shadow-lg" />
                        <div className="w-14 h-14 left-[32px] top-[32px] absolute bg-neutral-50 rounded-xl flex items-center justify-center">
                            <span className="text-emerald-400 font-bold text-xl">✓</span>
                        </div>
                        <div className="left-[102px] top-[32px] absolute inline-flex flex-col justify-start items-start gap-2">
                            <div className="justify-start text-neutral-50/50 text-sm font-normal font-['Inter']">Experienced psychologists</div>
                            <div className="justify-start text-neutral-50 text-2xl font-bold font-['Inter']">15,000</div>
                        </div>
                     </div>

                     {/* Mobile stats card */}
                     <div className="mt-4 w-full max-w-xs mx-auto md:hidden animate-slideUp delay-500">
                        <div className="relative w-full bg-emerald-400 rounded-[20px] shadow-lg px-4 py-3 flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 font-bold text-lg">✓</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-neutral-50/70 text-xs font-normal font-['Inter']">
                              Experienced psychologists
                            </span>
                            <span className="text-neutral-50 text-xl font-bold font-['Inter']">
                              15,000
                            </span>
                          </div>
                        </div>
                     </div>

                     <div className="absolute top-[195px] left-[-32px] w-10 h-10 origin-center -rotate-[15deg] bg-[#4535af] rounded-[10px] flex items-center justify-center hidden md:flex shadow-md animate-bounce">
                        <svg
                          width="10"
                          height="17"
                          viewBox="0 0 10 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.5 5.3125C2.5 4.14043 3.39687 3.1875 4.5 3.1875H5.5C6.60313 3.1875 7.5 4.14043 7.5 5.3125V5.43203C7.5 6.15586 7.15313 6.82988 6.58125 7.21836L5.2625 8.11817C4.8753 8.38268 4.5568 8.74625 4.33622 9.17554C4.11564 9.60483 4.00003 10.0861 4 10.5752V10.625C4 11.2127 4.44688 11.6875 5 11.6875C5.55312 11.6875 6 11.2127 6 10.625V10.5785C6 10.3063 6.13125 10.0539 6.34375 9.90781L7.6625 9.00801C8.80625 8.22442 9.5 6.87969 9.5 5.43203V5.3125C9.5 2.96504 7.70937 1.0625 5.5 1.0625H4.5C2.29063 1.0625 0.5 2.96504 0.5 5.3125C0.5 5.9002 0.946875 6.375 1.5 6.375C2.05313 6.375 2.5 5.9002 2.5 5.3125ZM5 15.9375C5.33152 15.9375 5.64946 15.7976 5.88388 15.5485C6.1183 15.2994 6.25 14.9616 6.25 14.6094C6.25 14.2571 6.1183 13.9193 5.88388 13.6703C5.64946 13.4212 5.33152 13.2813 5 13.2813C4.66848 13.2813 4.35054 13.4212 4.11612 13.6703C3.8817 13.9193 3.75 14.2571 3.75 14.6094C3.75 14.9616 3.8817 15.2994 4.11612 15.5485C4.35054 15.7976 4.66848 15.9375 5 15.9375Z"
                            fill="#FBFBFB"
                          />
                        </svg>
                     </div>
                     
                     <div className="absolute top-[38px] -right-[40px] w-12 h-12 origin-center rotate-[15deg] bg-amber-300 rounded-[10px] flex items-center justify-center text-white font-bold text-xl hidden md:flex shadow-md animate-pulse">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_hero_badge)">
                            <path
                              d="M14.2705 16.994L13.8427 18.5907L2.66622 15.5959L3.09404 13.9993C3.09404 13.9993 3.94968 10.806 9.53793 12.3034C15.1262 13.8007 14.2705 16.994 14.2705 16.994ZM13.5086 8.66129C13.6566 8.10866 13.6375 7.52454 13.4536 6.98278C13.2697 6.44102 12.9293 5.96596 12.4754 5.61768C12.0215 5.26939 11.4745 5.06352 10.9036 5.0261C10.3327 4.98869 9.76356 5.1214 9.26809 5.40746C8.77262 5.69352 8.3731 6.12008 8.12006 6.6332C7.86702 7.14632 7.77181 7.72295 7.84649 8.29018C7.92117 8.8574 8.16237 9.38975 8.53959 9.81989C8.91682 10.25 9.41313 10.5587 9.96575 10.7067C10.7068 10.9053 11.4964 10.8013 12.1608 10.4178C12.8252 10.0342 13.31 9.40234 13.5086 8.66129ZM15.0783 13.7879C15.4673 14.2992 15.7395 14.8895 15.8758 15.5174C16.0121 16.1452 16.0092 16.7953 15.8672 17.4219L15.4394 19.0185L18.6327 19.8741L19.0605 18.2775C19.0605 18.2775 19.837 15.3796 15.0783 13.7879ZM16.2531 6.40194C15.7044 6.25164 15.1229 6.27193 14.5861 6.4601C14.8895 7.2676 14.9325 8.1498 14.7093 8.98302C14.486 9.81624 14.0076 10.5587 13.3411 11.1063C13.712 11.5377 14.2054 11.846 14.7557 11.9902C15.4967 12.1888 16.2863 12.0848 16.9507 11.7012C17.6151 11.3176 18.0999 10.6858 18.2985 9.94475C18.4971 9.2037 18.3931 8.41412 18.0095 7.74972C17.6259 7.08531 16.9941 6.6005 16.2531 6.40194Z"
                              fill="#FBFBFB"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_hero_badge">
                              <rect
                                width="19.8356"
                                height="19.8356"
                                fill="white"
                                transform="translate(5.13385) rotate(15)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                     </div>
                </div>
            </div>
        </section>
    );
};

const PsychologistsPage = () => {
    const { user, favorites, toggleFavorite } = useAppContext();
    const [list, setList] = useState<Psychologist[]>([]);
    const [filter, setFilter] = useState<FilterType>(FilterType.SHOW_ALL);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isListLoading, setIsListLoading] = useState(true);

    useEffect(() => {
        setIsListLoading(true);
        const load = async () => {
          const psychologists = await fetchPsychologists();
          setList(psychologists);
          setIsListLoading(false);
        };

        void load();
    }, []);

    const getFilteredList = useCallback(() => {
        let sorted = [...list];
        switch (filter) {
            case FilterType.A_TO_Z: return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case FilterType.Z_TO_A: return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case FilterType.PRICE_LOW: return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
            case FilterType.PRICE_HIGH: return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
            case FilterType.RATING_LOW: return sorted.sort((a, b) => a.rating - b.rating);
            case FilterType.RATING_HIGH: return sorted.sort((a, b) => b.rating - a.rating);
            default: return sorted;
        }
    }, [list, filter]);

    const filteredData = getFilteredList();
    const displayList = filteredData.slice(0, visibleCount);
    const hasMore = visibleCount < filteredData.length;


    return (
        <div className="container mx-auto px-4 md:px-[128px] py-16 animate-fadeIn">
            <div className="mb-8 relative inline-flex flex-col justify-start items-start gap-2">
                <label className="text-zinc-500 text-sm font-medium leading-4">Filters</label>
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="h-12 pl-4 pr-5 bg-emerald-400 rounded-2xl flex justify-between items-center gap-10 text-neutral-50 text-base font-medium font-['Inter'] leading-5 min-w-[220px] hover:bg-emerald-500 transition-colors duration-300 shadow-md"
                    >
                        {filter}
                        <Icon
                          name="filter-chevron"
                          className={`w-[12px] h-[7px] text-neutral-50 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}
                          aria-hidden
                        />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-[0px_20px_69px_0px_rgba(0,0,0,0.07)] py-4 z-20 flex flex-col gap-2 animate-slideUp">
                            {Object.values(FilterType).map((f) => (
                                <button 
                                    key={f} 
                                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                    className={`text-left px-5 py-1 text-base font-normal leading-5 font-['Inter'] transition-colors duration-200 ${f === filter ? 'text-stone-900 font-semibold bg-zinc-50' : 'text-stone-900/30 hover:text-stone-900 hover:bg-zinc-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                {isListLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))
                ) : (
                    displayList.map((psych) => (
                        <PsychologistCard 
                            key={psych.name} 
                            data={psych} 
                            isAuthenticated={!!user}
                            isFavorite={favorites.includes(psych.id || psych.name)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))
                )}
            </div>

            {!isListLoading && filteredData.length > 0 && hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="px-8 py-3 bg-emerald-400 rounded-[30px] text-neutral-50 text-base font-medium font-['Inter'] leading-5 hover:bg-emerald-500 transition-colors shadow-md active:scale-95 duration-200"
                >
                  Load more
                </button>
              </div>
            )}
        </div>
    );
};

const FavoritesPage = () => {
    const { favorites, toggleFavorite, user } = useAppContext();
    const [list, setList] = useState<Psychologist[]>([]);
    const [filter, setFilter] = useState<FilterType>(FilterType.SHOW_ALL);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const favs = psychologistsData.filter(p => favorites.includes(p.id || p.name));
        setList(favs);
    }, [favorites]);

    const getFilteredList = () => {
         let sorted = [...list];
         switch (filter) {
             case FilterType.A_TO_Z: return sorted.sort((a, b) => a.name.localeCompare(b.name));
             case FilterType.Z_TO_A: return sorted.sort((a, b) => b.name.localeCompare(a.name));
             case FilterType.PRICE_LOW: return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
             case FilterType.PRICE_HIGH: return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
             case FilterType.RATING_LOW: return sorted.sort((a, b) => a.rating - b.rating);
             case FilterType.RATING_HIGH: return sorted.sort((a, b) => b.rating - a.rating);
             default: return sorted;
         }
    };

    if (!user) return <Navigate to="/" />;

    return (
        <div className="container mx-auto px-4 md:px-[128px] py-16 animate-fadeIn">
            <div className="mb-8 relative inline-flex flex-col justify-start items-start gap-2">
                <label className="text-zinc-500 text-sm font-medium font-['Inter'] leading-4">Filters</label>
                <div className="relative">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="h-12 pl-4 pr-5 bg-emerald-400 rounded-2xl flex justify-between items-center gap-10 text-neutral-50 text-base font-medium font-['Inter'] leading-5 min-w-[220px] hover:bg-emerald-500 transition-colors shadow-md"
                    >
                        {filter}
                        <Icon
                          name="filter-chevron"
                          className={`w-[12px] h-[7px] text-neutral-50 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}
                          aria-hidden
                        />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-[0px_20px_69px_0px_rgba(0,0,0,0.07)] py-4 z-20 flex flex-col gap-2 animate-slideUp">
                            {Object.values(FilterType).map((f) => (
                                <button 
                                    key={f} 
                                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                    className={`text-left px-5 py-1 text-base font-normal leading-5 font-['Inter'] transition-colors duration-200 ${f === filter ? 'text-stone-900 font-semibold bg-zinc-50' : 'text-stone-900/30 hover:text-stone-900 hover:bg-zinc-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {list.length === 0 ? (
                <p className="text-center text-stone-500 mt-10 animate-fadeIn">You haven't added any psychologists to your favorites yet.</p>
            ) : (
                <div className="space-y-8">
                    {getFilteredList().map((psych) => (
                        <PsychologistCard 
                            key={psych.name} 
                            data={psych} 
                            isAuthenticated={!!user}
                            isFavorite={true}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({ isOpen: false, mode: 'login' });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
          try {
             const favs = await fetchFavorites(currentUser.uid);
             setFavorites(favs || []);
          } catch {
             setFavorites([]);
          }
      } else {
          setFavorites([]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (id: string) => {
      if (!user) return;
      let newFavs: string[] = [];
      let isAdded = false;
      if (favorites.includes(id)) {
          newFavs = favorites.filter(fid => fid !== id);
      } else {
          newFavs = [...favorites, id];
          isAdded = true;
      }
      setFavorites(newFavs);
      if (isAdded) {
        showNotification("Added to favorites", "success");
      } else {
        showNotification("Removed from favorites", "info");
      }

      await syncFavorites(user.uid, newFavs);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
      setAuthModal({ isOpen: true, mode });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-100">
        <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 border-4 border-stone-200 border-t-emerald-400 rounded-full animate-spin"></div>
             <p className="text-stone-500 text-sm font-medium animate-pulse">Loading Psychology Services...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, favorites, toggleFavorite, openAuthModal, isLoading, showNotification }}>
      <HashRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/psychologists" element={<PsychologistsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
        </Layout>
        
        <Modal 
            isOpen={authModal.isOpen} 
            onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        >
            <AuthForms 
                mode={authModal.mode} 
                onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
            />
        </Modal>

        <Toast 
            message={toast.message} 
            type={toast.type} 
            isVisible={toast.isVisible} 
            onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;