export async function getJSON(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
    }
    return response.json()
}export const CITIES = [
    { name: "Kigali", province: "Kigali City", lat: -1.9441, lon: 30.0619 },
    { name: "Huye", province: "Southern", lat: -2.5967, lon: 29.7394 },
    { name: "Muhanga", province: "Southern", lat: -2.0847, lon: 29.7567 },
    { name: "Musanze", province: "Northern", lat: -1.4998, lon: 29.6347 },
    { name: "Rubavu", province: "Western", lat: -1.6786, lon: 29.2606 },
    { name: "Rusizi", province: "Western", lat: -2.4844, lon: 28.9075 },
    { name: "Rwamagana", province: "Eastern", lat: -1.9487, lon: 30.4347 },
    { name: "Nyagatare", province: "Eastern", lat: -1.2975, lon: 30.3275 },
]

export const buildForecastUrl = ({ lat, lon }) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa%2FKigali`

export const getCityForecast = (city) => getJSON(buildForecastUrl(city))