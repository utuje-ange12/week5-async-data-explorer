import { escapeHTML } from "./utils.js"

const app = document.querySelector("#app")
const statusEl = document.querySelector("#status")

const skeletonCard = () => `
  <div class="animate-pulse rounded-xl bg-white p-4 shadow">
    <div class="h-5 w-1/2 rounded bg-slate-200"></div>
    <div class="mt-3 h-4 w-3/4 rounded bg-slate-200"></div>
    <div class="mt-2 h-4 w-2/3 rounded bg-slate-200"></div>
  </div>`

const card = ({ name, province, days }) => {
    const { max, min, rain } = days?.[0] ?? {}
    return `
    <button type="button" data-city="${escapeHTML(name)}"
      class="rounded-xl bg-white p-4 text-left shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
      <h2 class="text-lg font-semibold">${escapeHTML(name)}</h2>
      <p class="text-sm text-slate-500">${escapeHTML(province)}</p>
      <p class="mt-3 text-2xl font-bold text-emerald-600">${escapeHTML(max ?? "--")}°C</p>
      <p class="text-sm text-slate-600">Low ${escapeHTML(min ?? "--")}°C</p>
      <p class="text-sm text-slate-600">Rain ${escapeHTML(rain ?? 0)} mm</p>
    </button>`
}

export function render(state) {
    if (state.status === "loading") {
        statusEl.textContent = "Loading forecasts..."
        app.innerHTML = `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${Array.from({ length: 8 }, skeletonCard).join("")}</div>`
        return
    }

    if (state.status === "error") {
        statusEl.textContent = "Something went wrong."
        app.innerHTML = `
      <div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p class="font-medium text-red-700">We could not load the weather. (${escapeHTML(state.error)})</p>
        <button data-action="retry" class="mt-4 rounded bg-red-600 px-4 py-2 text-white">Retry</button>
      </div>`
        return
    }

    if (state.items.length === 0) {
        statusEl.textContent = "No cities found."
        app.innerHTML = `<p class="rounded-xl bg-white p-6 text-center text-slate-600">No cities found. Try a different search.</p>`
        return
    }

    const failedNote = state.failed.length ? ` (${state.failed.join(", ")} could not load)` : ""
    statusEl.textContent = `Showing ${state.items.length} cities${failedNote}`
    app.innerHTML = `<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">${state.items.map(card).join("")}</div>`
}
