import { NextResponse } from "next/server";

// WMO Weather interpretation codes → Portuguese labels
const WMO_LABELS: Record<number, string> = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com gelo",
  51: "Chuvisco leve",
  53: "Chuvisco moderado",
  55: "Chuvisco intenso",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  71: "Nevada leve",
  73: "Nevada moderada",
  75: "Nevada forte",
  80: "Aguaceiros leves",
  81: "Aguaceiros moderados",
  82: "Aguaceiros fortes",
  95: "Trovoada",
  96: "Trovoada com granizo",
  99: "Trovoada intensa",
};

export type WeatherData = {
  temperature: number;
  weatherCode: number;
  label: string;
  location: string;
  isDay: boolean;
};

export async function GET() {
  try {
    // Faro, Algarve coordinates
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=37.0194&longitude=-7.9322&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=Europe%2FLisbon";

    const response = await fetch(url, { next: { revalidate: 1800 } });

    if (!response.ok) {
      throw new Error(`Open-Meteo error: ${response.status}`);
    }

    const json = (await response.json()) as {
      current: {
        temperature_2m: number;
        weather_code: number;
        is_day: number;
      };
    };

    const { temperature_2m, weather_code, is_day } = json.current;

    const data: WeatherData = {
      temperature: Math.round(temperature_2m),
      weatherCode: weather_code,
      label: WMO_LABELS[weather_code] ?? "Condições variáveis",
      location: "Faro, Algarve",
      isDay: is_day === 1,
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("Weather fetch failed", error);
    return NextResponse.json({ error: "Nao foi possivel obter o clima." }, { status: 502 });
  }
}
