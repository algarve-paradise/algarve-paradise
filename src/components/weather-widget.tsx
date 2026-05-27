import type { WeatherData } from "@/app/api/weather/route";

// SVG icons keyed by WMO code group
function WeatherIcon({ code, isDay, className }: { code: number; isDay: boolean; className?: string }) {
  // Sun / clear
  if (code === 0 || code === 1) {
    if (isDay) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    }
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  // Partly cloudy
  if (code === 2) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }

  // Rain / showers / drizzle
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" />
        <line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      </svg>
    );
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
        <line x1="8" y1="16" x2="8" y2="21" />
        <line x1="8" y1="21" x2="6" y2="19" />
        <line x1="8" y1="21" x2="10" y2="19" />
        <line x1="12" y1="18" x2="12" y2="23" />
        <line x1="12" y1="23" x2="10" y2="21" />
        <line x1="12" y1="23" x2="14" y2="21" />
        <line x1="16" y1="16" x2="16" y2="21" />
        <line x1="16" y1="21" x2="14" y2="19" />
        <line x1="16" y1="21" x2="18" y2="19" />
      </svg>
    );
  }

  // Thunder
  if (code >= 95) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    );
  }

  // Fog / default cloud
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=37.0194&longitude=-7.9322&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=Europe%2FLisbon";

    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return null;

    const json = (await response.json()) as {
      current: { temperature_2m: number; weather_code: number; is_day: number };
    };

    const WMO_LABELS: Record<number, string> = {
      0: "Céu limpo", 1: "Principalmente limpo", 2: "Parcialmente nublado",
      3: "Nublado", 45: "Nevoeiro", 48: "Nevoeiro com gelo",
      51: "Chuvisco leve", 53: "Chuvisco moderado", 55: "Chuvisco intenso",
      61: "Chuva leve", 63: "Chuva moderada", 65: "Chuva forte",
      71: "Nevada leve", 73: "Nevada moderada", 75: "Nevada forte",
      80: "Aguaceiros leves", 81: "Aguaceiros moderados", 82: "Aguaceiros fortes",
      95: "Trovoada", 96: "Trovoada com granizo", 99: "Trovoada intensa",
    };

    const { temperature_2m, weather_code, is_day } = json.current;
    return {
      temperature: Math.round(temperature_2m),
      weatherCode: weather_code,
      label: WMO_LABELS[weather_code] ?? "Condições variáveis",
      location: "Faro, Algarve",
      isDay: is_day === 1,
    };
  } catch {
    return null;
  }
}

export async function WeatherWidget() {
  const weather = await fetchWeather();

  if (!weather) return null;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-white/60 px-4 py-2 backdrop-blur-sm shadow-sm">
      <WeatherIcon
        code={weather.weatherCode}
        isDay={weather.isDay}
        className="size-5 shrink-0 text-foreground/80"
      />
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold leading-none text-foreground">
          {weather.temperature}°C
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/60">
          {weather.label}
        </span>
      </div>
      <span className="hidden text-[10px] uppercase tracking-[0.18em] text-foreground/50 sm:block">
        {weather.location}
      </span>
    </div>
  );
}
