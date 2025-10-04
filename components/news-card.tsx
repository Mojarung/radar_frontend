"use client";

import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Clock, TrendingUp } from "lucide-react";

interface NewsCardProps {
  news: AnalysisResult;
}

export function NewsCard({ news }: NewsCardProps) {
  const [open, setOpen] = useState(false);

  const getHotnessColor = (hotness: number) => {
    if (hotness >= 0.8) return "bg-red-500 glow-pink";
    if (hotness >= 0.6) return "bg-orange-500";
    if (hotness >= 0.4) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getHotnessLabel = (hotness: number) => {
    if (hotness >= 0.8) return "🔥 ОЧЕНЬ ГОРЯЧО";
    if (hotness >= 0.6) return "⚡ ГОРЯЧО";
    if (hotness >= 0.4) return "📊 ТЕПЛО";
    return "📰 АКТУАЛЬНО";
  };

  return (
    <>
      <Card className="hover:glow-pink transition-all duration-300 border-primary/30 flex flex-col">
        <CardHeader className="cursor-pointer" onClick={() => setOpen(true)}>
          <div className="flex justify-between items-start gap-4 mb-2">
            <CardTitle className="text-lg font-bold text-primary">{news.headline}</CardTitle>
            <Badge className={`${getHotnessColor(news.hotness)} whitespace-nowrap`}>
              {getHotnessLabel(news.hotness)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col cursor-pointer" onClick={() => setOpen(true)}>
          <p className="text-muted-foreground mb-4">{news.why_now}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {news.entities.slice(0, 3).map((entity, idx) => (
              <Badge key={idx} variant="outline" className="border-secondary/50">
                {entity}
              </Badge>
            ))}
            {news.entities.length > 3 && (
              <Badge variant="outline" className="border-secondary/50">
                +{news.entities.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Горячесть: {(news.hotness * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{news.sources.length} источников</span>
            </div>
          </div>

          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setOpen(true); 
            }}
            className="w-full mt-auto py-2.5 px-4 rounded-lg bg-muted/50 hover:bg-muted/70 text-foreground font-medium text-sm border border-border transition-colors duration-200"
          >
            Подробнее
          </button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar border-primary/50 bg-white text-gray-900">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl text-gray-900 font-bold">{news.headline}</DialogTitle>
              <Badge className={`${getHotnessColor(news.hotness)} text-lg px-4 py-1`}>
                {(news.hotness * 100).toFixed(0)}%
              </Badge>
            </div>
            <DialogDescription className="text-base pt-2 text-gray-700">{news.why_now}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Draft */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2 text-purple-600">📝 Черновик поста</h3>
              <div className="whitespace-pre-wrap text-sm text-gray-800">{news.draft}</div>
            </div>

            {/* Entities */}
            {news.entities.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-purple-600">🎯 Ключевые сущности</h3>
                <div className="flex flex-wrap gap-2">
                  {news.entities.map((entity, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-3 py-1 bg-purple-100 text-purple-800">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {news.timeline.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-purple-600">📅 Временная шкала</h3>
                <div className="space-y-3">
                  {news.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 border-l-2 border-pink-400 pl-4 py-2">
                      <div className="text-sm text-gray-600 whitespace-nowrap">{event.time}</div>
                      <div className="text-sm text-gray-800">{event.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {news.sources.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-purple-600">🔗 Источники</h3>
                <div className="space-y-2">
                  {news.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-pink-600 hover:underline">{source.title}</div>
                      {source.published_at && (
                        <div className="text-xs text-gray-500 mt-1">{new Date(source.published_at).toLocaleString('ru-RU')}</div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

