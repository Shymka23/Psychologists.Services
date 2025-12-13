import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Psychologist } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { AppointmentForm } from './AppointmentForm';
import { useAppContext } from '../context';

interface PsychologistCardProps {
  data: Psychologist;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isAuthenticated?: boolean; 
}

export const PsychologistCard: React.FC<PsychologistCardProps> = ({ 
  data, 
  isFavorite, 
  onToggleFavorite, 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const { user, showNotification } = useAppContext();

  const handleFavoriteClick = () => {
    if (!user) {
      showNotification("Please register to add to favorites", "info");
      return;
    }
    onToggleFavorite(data.id || data.name);
  };

  const handleAppointmentClick = () => {
    if (!user) {
      showNotification("Please register to make an appointment", "info");
      return;
    }
    setIsAppointmentOpen(true);
  };

  return (
    <div className="bg-neutral-50 rounded-3xl p-6 md:p-6 w-full relative flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
      <div className="shrink-0 relative">
        <div className="w-[120px] h-[120px] relative rounded-[30px] outline outline-2 outline-offset-[-2px] outline-emerald-400/20 flex items-center justify-center">
          <div className="w-[96px] h-[96px] rounded-[15px] overflow-hidden">
            <img
              src={data.avatar_url}
              alt={data.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-125"
            />
          </div>
          <div className="w-3.5 h-3.5 absolute right-2 top-2 bg-neutral-50 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
                <p className="text-zinc-500 text-base font-medium leading-6 mb-2">Psychologist</p>
                <h3 className="text-stone-900 text-2xl font-medium leading-6">{data.name}</h3>
            </div>
            
            <div className="flex flex-row items-center gap-8 mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-stone-900 font-medium">
                    <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                    <span className="text-base font-medium leading-6">Rating: {data.rating}</span>
                </div>
                <div className="h-4 w-px bg-stone-900/20 hidden md:block"></div>
                <div className="text-stone-900 font-medium text-base leading-6">
                    Price / 1 hour: <span className="text-green-500">{data.price_per_hour}$</span>
                </div>
                <button 
                  onClick={handleFavoriteClick} 
                  className="ml-4 transition-transform active:scale-90 hover:scale-110 duration-200"
                >
                    <Heart 
                        className={`w-6 h-6 transition-colors duration-300 ${isFavorite ? "fill-emerald-400 text-emerald-400" : "text-stone-900 hover:text-emerald-400"}`} 
                    />
                </button>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-zinc-100 px-4 py-2 rounded-3xl inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-default">
                <span className="text-zinc-500 text-base font-medium leading-6">Experience:</span>
                <span className="text-stone-900 text-base font-medium leading-6">{data.experience}</span>
            </span>
            <span className="bg-zinc-100 px-4 py-2 rounded-3xl inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-default">
                <span className="text-zinc-500 text-base font-medium leading-6">License:</span>
                <span className="text-stone-900 text-base font-medium leading-6">{data.license}</span>
            </span>
            <span className="bg-zinc-100 px-4 py-2 rounded-3xl inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-default">
                <span className="text-zinc-500 text-base font-medium leading-6">Specialization:</span>
                <span className="text-stone-900 text-base font-medium leading-6">{data.specialization}</span>
            </span>
             <span className="bg-zinc-100 px-4 py-2 rounded-3xl inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-default">
                <span className="text-zinc-500 text-base font-medium leading-6">Initial_consultation:</span>
                <span className="text-stone-900 text-base font-medium leading-6">{data.initial_consultation}</span>
            </span>
        </div>

        <p className="text-stone-900/50 text-base font-normal leading-5 mb-4">{data.about}</p>

        {isExpanded && (
            <div className="mt-8 space-y-6 animate-fadeIn">
                {data.reviews.map((review, idx) => (
                    <div key={idx} className="flex flex-col gap-4 animate-slideUp" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex items-start gap-3">
                             <div className="w-11 h-11 bg-emerald-400/20 rounded-full flex items-center justify-center text-emerald-400 text-xl font-medium shrink-0">
                                 {review.reviewer.charAt(0)}
                             </div>
                             <div>
                                 <h5 className="text-stone-900 text-base font-medium leading-5">{review.reviewer}</h5>
                                 <div className="flex items-center gap-2 mt-1">
                                     <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                                     <span className="text-stone-900 text-sm font-medium leading-4">{review.rating}</span>
                                 </div>
                             </div>
                        </div>
                        <p className="text-stone-900/50 text-base font-normal leading-5">{review.comment}</p>
                    </div>
                ))}
                <div className="pt-4 animate-slideUp delay-200">
                     <Button onClick={handleAppointmentClick}>Make an appointment</Button>
                </div>
            </div>
        )}

        {!isExpanded && (
             <button 
             onClick={() => setIsExpanded(true)}
             className="text-stone-900 text-base font-medium underline leading-6 hover:text-emerald-500 transition-colors"
           >
             Read more
           </button>
        )}
      </div>

      <Modal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)}>
        <AppointmentForm psychologist={data} onClose={() => setIsAppointmentOpen(false)} />
      </Modal>
    </div>
  );
};