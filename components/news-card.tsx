"use client";

import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <Card className="hover:glow-pink transition-all duration-300 cursor-pointer border-primary/30" onClick={() => setOpen(true)}>
        <CardHeader>
          <div className="flex justify-between items-start gap-4 mb-2">
            <CardTitle className="text-lg font-bold text-primary">{news.headline}</CardTitle>
            <Badge className={`${getHotnessColor(news.hotness)} whitespace-nowrap`}>
              {getHotnessLabel(news.hotness)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Горячесть: {(news.hotness * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{news.sources.length} источников</span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-primary/90 to-secondary/90 hover:from-primary hover:to-secondary text-white font-semibold border-0" onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
            Подробнее
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-primary/50">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl text-primary text-glow-pink">{news.headline}</DialogTitle>
              <Badge className={`${getHotnessColor(news.hotness)} text-lg px-4 py-1`}>
                {(news.hotness * 100).toFixed(0)}%
              </Badge>
            </div>
            <DialogDescription className="text-base pt-2">{news.why_now}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Draft */}
            <div className="bg-card/50 p-4 rounded-lg border border-primary/30">
              <h3 className="font-bold text-lg mb-2 text-secondary">📝 Черновик поста</h3>
              <div className="whitespace-pre-wrap text-sm">{news.draft}</div>
            </div>

            {/* Entities */}
            {news.entities.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-secondary">🎯 Ключевые сущности</h3>
                <div className="flex flex-wrap gap-2">
                  {news.entities.map((entity, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {news.timeline.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-secondary">📅 Временная шкала</h3>
                <div className="space-y-3">
                  {news.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 border-l-2 border-primary/50 pl-4 py-2">
                      <div className="text-sm text-muted-foreground whitespace-nowrap">{event.time}</div>
                      <div className="text-sm">{event.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {news.sources.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 text-secondary">🔗 Источники</h3>
                <div className="space-y-2">
                  {news.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      <div className="text-sm font-medium text-primary hover:underline">{source.title}</div>
                      {source.published_at && (
                        <div className="text-xs text-muted-foreground mt-1">{new Date(source.published_at).toLocaleString('ru-RU')}</div>
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

