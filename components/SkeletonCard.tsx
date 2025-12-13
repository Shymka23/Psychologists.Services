import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-neutral-50 rounded-3xl p-6 md:p-6 w-full flex flex-col md:flex-row gap-6 border border-stone-100/50">
      <div className="shrink-0">
        <div className="w-[120px] h-[120px] rounded-[30px] flex items-center justify-center bg-zinc-100 animate-pulse">
            <div className="w-24 h-24 bg-zinc-200 rounded-2xl"></div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-4">
                <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse"></div>
            </div>
        </div>

        <div className="flex gap-2 flex-wrap">
            <div className="h-10 w-32 bg-zinc-100 rounded-3xl animate-pulse"></div>
            <div className="h-10 w-40 bg-zinc-100 rounded-3xl animate-pulse"></div>
            <div className="h-10 w-28 bg-zinc-100 rounded-3xl animate-pulse"></div>
        </div>

        <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-zinc-100 rounded animate-pulse"></div>
            <div className="h-4 w-[90%] bg-zinc-100 rounded animate-pulse"></div>
            <div className="h-4 w-[80%] bg-zinc-100 rounded animate-pulse"></div>
        </div>

        <div className="h-6 w-20 bg-zinc-200 rounded animate-pulse mt-4"></div>
      </div>
    </div>
  );
};