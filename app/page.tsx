"use client";

import { useState, useEffect } from "react";
import { analyzeNews } from "@/lib/api";
import { AnalysisResponse } from "@/lib/types";
import { NewsCard } from "@/components/news-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Loader2 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<number>(720);
  const [topK, setTopK] = useState<number>(10);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeNews({
        time_window_hours: timeWindow,
        top_k: topK,
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background cyber-grid flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-primary text-glow-pink mb-2">
            MOJARUNG RADAR
          </h1>
          <p className="text-muted-foreground">
            Система выявления и оценки горячих новостей в финансах
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-card/95 backdrop-blur-xl rounded-lg p-6 border border-primary/40 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Временной период
              </label>
              <Select
                value={timeWindow.toString()}
                onValueChange={(value) => setTimeWindow(Number(value))}
              >
                <SelectTrigger className="border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Последний час</SelectItem>
                  <SelectItem value="3">Последние 3 часа</SelectItem>
                  <SelectItem value="6">Последние 6 часов</SelectItem>
                  <SelectItem value="12">Последние 12 часов</SelectItem>
                  <SelectItem value="24">Последние 24 часа</SelectItem>
                  <SelectItem value="48">Последние 2 дня</SelectItem>
                  <SelectItem value="72">Последние 3 дня</SelectItem>
                  <SelectItem value="168">Последняя неделя</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Количество новостей
              </label>
              <Select
                value={topK.toString()}
                onValueChange={(value) => setTopK(Number(value))}
              >
                <SelectTrigger className="border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Топ 5</SelectItem>
                  <SelectItem value="10">Топ 10</SelectItem>
                  <SelectItem value="15">Топ 15</SelectItem>
                  <SelectItem value="20">Топ 20</SelectItem>
                  <SelectItem value="30">Топ 30</SelectItem>
                  <SelectItem value="50">Топ 50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={fetchNews}
              disabled={loading}
              className="bg-primary hover:bg-primary/80 glow-pink"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Обновить
                </>
              )}
            </Button>
          </div>

          {/* Stats */}
          {data && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-primary/30">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                📊 Проанализировано статей: {data.total_articles_analyzed}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                📰 Найдено кластеров: {data.total_clusters}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                🕐 Обновлено: {new Date(data.analysis_timestamp).toLocaleString('ru-RU')}
              </Badge>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
            <p className="text-destructive font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Анализируем новости...</p>
            </div>
          </div>
        )}

        {/* News Grid */}
        {!loading && data && data.results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((news) => (
              <NewsCard key={news.dedup_group} news={news} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data && data.results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">Новостей не найдено</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить временной период или параметры фильтра
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/30 bg-card/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>MOJARUNG RADAR © 2025 | Система анализа финансовых новостей</p>
        </div>
      </footer>
    </div>
  );
}
