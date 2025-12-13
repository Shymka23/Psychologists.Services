import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from './Button';
import { AppointmentFormData, Psychologist } from '../types';
import { useAppContext } from '../context';

interface AppointmentFormProps {
  psychologist: Psychologist;
  onClose: () => void;
}

const schema = yup.object({
  name: yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: yup.string()
    .matches(/^\+?[0-9]{10,15}$/, 'Phone must be 10-15 digits (e.g. +380...)')
    .required('Phone number is required'),
  time: yup.string()
    .required('Time is required'),
  comment: yup.string()
    .min(5, 'Comment is too short')
    .required('Comment is required'),
}).required();

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ psychologist, onClose }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<AppointmentFormData>({
    resolver: yupResolver(schema)
  });
  const { showNotification } = useAppContext();
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const selectedTime = watch('time');

  const onSubmit = (data: AppointmentFormData) => {
    showNotification(`Appointment request sent for ${psychologist.name}!`, 'success');
    reset();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00"
  ];

  return (
    <div className="p-16 animate-slideUp">
      <div className="mb-10">
        <h2 className="text-stone-900 text-4xl font-medium mb-5 leading-[48px]">Make an appointment with a psychologists</h2>
        <p className="text-stone-900/50 text-base font-normal leading-5">You are on the verge of changing your life for the better. Fill out the short form below to book your personal appointment with a professional psychologist. We guarantee confidentiality and respect for your privacy.</p>
      </div>

      <div className="flex items-start gap-3.5 mb-10">
        <img 
          src={psychologist.avatar_url} 
          alt={psychologist.name} 
          className="w-11 h-11 rounded-2xl object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-zinc-500 text-xs font-medium leading-4 font-['Inter']">Your psychologists</p>
          <p className="text-stone-900 text-base font-medium leading-6 font-['Inter']">{psychologist.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
        <div className="relative">
            <input 
            {...register("name")}
            placeholder="Name"
            className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.name ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 font-['Inter'] transition-all duration-300`}
            />
            {errors.name && <p className="text-red-500 text-xs absolute -bottom-6 left-1">{errors.name.message}</p>}
        </div>

        <div className="flex gap-4">
            <div className="flex-1 relative">
                <input 
                {...register("phone")}
                placeholder="+380"
                className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.phone ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 font-['Inter'] transition-all duration-300`}
                />
                 {errors.phone && <p className="text-red-500 text-xs absolute -bottom-6 left-1">{errors.phone.message}</p>}
            </div>
            
            <div className="flex-1 relative" ref={timeDropdownRef}>
                <div 
                    onClick={() => setIsTimeOpen(!isTimeOpen)}
                    className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.time ? 'outline-red-500' : 'outline-stone-900/10'} ${isTimeOpen ? 'outline-emerald-400' : ''} cursor-pointer flex justify-between items-center transition-all duration-300`}
                >
                    <span className={`text-base font-normal leading-5 font-['Inter'] ${selectedTime ? 'text-stone-900' : 'text-stone-900'}`}>
                        {selectedTime || "00:00"}
                    </span>
                    <div className="w-5 h-5 relative overflow-hidden">
                         <div className="w-4 h-4 left-[1.67px] top-[1.67px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-stone-900 rounded-full" />
                         <div className="w-[3.33px] h-1.5 left-[10px] top-[5px] absolute border-l-[1.5px] border-stone-900" />
                    </div>
                </div>
                {errors.time && <p className="text-red-500 text-xs absolute -bottom-6 left-1">{errors.time.message}</p>}

                {isTimeOpen && (
                    <div className="absolute top-full mt-2 right-0 w-36 h-44 bg-white rounded-xl shadow-[0px_20px_69px_0px_rgba(0,0,0,0.07)] z-50 overflow-y-auto animate-scaleIn">
                        <div className="p-4">
                             <div className="text-stone-900 text-base font-medium font-['Inter'] leading-6 mb-3 text-center sticky top-0 bg-white">Meeting time</div>
                             <div className="flex flex-col gap-2">
                                {timeSlots.map(time => (
                                    <div 
                                        key={time} 
                                        onClick={() => {
                                            setValue('time', time, { shouldValidate: true });
                                            setIsTimeOpen(false);
                                        }}
                                        className={`text-center py-1 rounded cursor-pointer hover:bg-zinc-100 text-stone-900 text-base font-medium font-['Inter'] leading-5 transition-colors ${selectedTime === time ? 'bg-emerald-50 text-emerald-500' : 'text-stone-900/30'}`}
                                    >
                                        {time}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="relative">
            <input 
            {...register("email")}
            placeholder="Email"
            className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.email ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 font-['Inter'] transition-all duration-300`}
            />
            {errors.email && <p className="text-red-500 text-xs absolute -bottom-6 left-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
            <textarea 
            {...register("comment")}
            placeholder="Comment"
            rows={3}
            className={`w-full p-4 rounded-xl bg-transparent outline outline-1 outline-offset-[-1px] ${errors.comment ? 'outline-red-500' : 'outline-stone-900/10'} focus:outline-emerald-400 text-stone-900 placeholder:text-stone-900 text-base font-normal leading-5 font-['Inter'] resize-none h-[120px] transition-all duration-300`}
            />
            {errors.comment && <p className="text-red-500 text-xs absolute -bottom-6 left-1">{errors.comment.message}</p>}
        </div>

        <Button type="submit" size="md" className="w-full mt-4 !py-4 bg-emerald-400 hover:bg-emerald-500 text-neutral-50 rounded-[30px] text-base font-medium font-['Inter'] transition-all shadow-md hover:-translate-y-1 active:scale-95 duration-200">Send</Button>
      </form>
    </div>
  );
};